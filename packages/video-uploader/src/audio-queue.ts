import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
import { downloadM3U8ToMP3 } from "./utils/ffmpeg";
import { logger } from "./utils/logger";
import connection from "./utils/mq";

const convertAudioToText = async (filepath: string) => {
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
    return response.json();
  } catch (e) {
    console.error(e);
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
        const payload = Buffer.from(msg.content).toString();
        const data = JSON.parse(payload);
        console.log("payload2", data);
        await downloadM3U8ToMP3(
          data.session.videoUrl,
          data.session.slug,
          "./tmp",
        );
        const transcripts = await convertAudioToText(
          `./tmp/${data.session.slug}.mp3`,
        );
        console.log("transcripts", transcripts);
        fs.unlinkSync(`./tmp/${data.session.slug}.mp3`);
        // await sessions.findOneAndUpdate(
        //   { _id: ObjectId.createFromHexString(data.sessionId) },
        //   {
        //     audioTranscripts: transcripts,
        //   }
        // );
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
