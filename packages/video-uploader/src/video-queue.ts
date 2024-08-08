import { config } from "dotenv";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import { downloadM3U8ToMP4 } from "./utils/ffmpeg";
import { logger } from "./utils/logger";
import connection from "./utils/mq";
import { uploadToYouTube } from "./utils/youtube";

config();

const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);
const sessions = db.collection("sessions");

async function videoUploader() {
  try {
    const queue = "videos";
    const channel = await (await connection).createChannel();
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(
      queue,
      async (msg) => {
        const payload = Buffer.from(msg.content).toString();
        const data = JSON.parse(payload);
        await downloadM3U8ToMP4(
          data.session.videoUrl,
          data.session.slug,
          "./tmp",
        );
        await uploadToYouTube(
          data.session,
          `./tmp/${data.session.slug}.mp4`,
          data.token,
        );
        fs.unlinkSync(`./tmp/${data.session.slug}.mp4`);
        await sessions.findOneAndUpdate(
          { _id: ObjectId.createFromHexString(data.sessionId) },
          {
            $addToSet: {
              socials: { name: data.type, date: new Date().getTime() },
            },
          },
        );
      },
      {
        noAck: true,
      },
    );
  } catch (e) {
    logger.error("error", e);
  }
}

videoUploader();
