import { config } from "dotenv";
import FormData from "form-data";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import fetch from "node-fetch";
import { downloadM3U8ToMP3 } from "./utils/ffmpeg";
import { jsonToVtt, uploadFile } from "./utils/helper";
import { logger } from "./utils/logger";
import connection from "./utils/mq";
config();

const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);
const sessions = db.collection("sessions");

const convertAudioToText = async (
  sessionId: string,
  filepath: string,
): Promise<{ url: string; text: string }> => {
  try {
    const form = new FormData();
    form.append("audio", fs.createReadStream(filepath));
    form.append("model_id", "openai/whisper-large-v3");
    const response = await fetch(
      `${process.env.LIVEPEER_GATEWAY_URL}/audio-to-text`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_GATEWAY_KEY}`,
          ...form.getHeaders(),
        },
        body: form,
      },
    );
    const data = await response.json();
    const transcriptions = jsonToVtt(data);
    const url = await uploadFile(
      `transcriptions/${sessionId}.vtt`,
      transcriptions,
    );
    return {
      url: url,
      text: data.text,
    };
  } catch (e) {
    logger.error(e);
  }
};

async function audioConverter() {
  try {
    const queue = "audio";
    const channel = await (await connection).createChannel();
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(
      queue,
      async (msg) => {
        try {
          const payload = Buffer.from(msg.content).toString();
          const data = JSON.parse(payload);
          await downloadM3U8ToMP3(
            data.session.videoUrl,
            data.session.slug,
            "./tmp",
          );
          const transcript = await convertAudioToText(
            data.sessionId,
            `./tmp/${data.session.slug}.mp3`,
          );
          await sessions.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(data.sessionId) },
            {
              $set: {
                videoTranscription: transcript.url,
                aiDescription: transcript.text,
              },
            },
          );
          fs.unlinkSync(`./tmp/${data.session.slug}.mp3`);
        } catch (e) {
          logger.error("error", e);
        }
      },
      {
        noAck: true,
      },
    );
  } catch (e) {
    logger.error("error", e);
  }
}

audioConverter();
