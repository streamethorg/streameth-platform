import { config } from 'dotenv';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import { errorMessageToStatusCode } from './utils/errors';
import { downloadM3U8ToMP4 } from './utils/ffmpeg';
import { logger } from './utils/logger';
import connection from './utils/mq';
import { uploadToTwitter } from './utils/twitter';
import { uploadToYouTube } from './utils/youtube';

config();

const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);
const sessions = db.collection('sessions');
const states = db.collection('states');

const updateVideoState = async (
  sessionId: string,
  socialType: string,
  status: string
) => {
  const state = await states.findOne({
    sessionId: ObjectId.createFromHexString(sessionId),
    type: 'social',
    socialType: socialType,
  });
  await states.findOneAndUpdate(
    {
      _id: ObjectId.createFromHexString(state._id.toString()),
    },
    {
      $set: {
        status: status,
      },
    }
  );
};
async function videoUploader() {
  try {
    const queue = 'videos';
    const channel = await (await connection).createChannel();
    let data;
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(
      queue,
      async (msg) => {
        try {
          const payload = Buffer.from(msg.content).toString();
          data = JSON.parse(payload);
          await downloadM3U8ToMP4(
            data.session.videoUrl,
            data.session.slug,
            './tmp'
          );
          if(data.type === 'youtube') {
            await uploadToYouTube(
              data.session,
              `./tmp/${data.session.slug}.mp4`,
              data.token
            );
          }
          if(data.type === 'twitter') {
            await uploadToTwitter(
              data.session,
              `./tmp/${data.session.slug}.mp4`,
              data.token
            );
          }
          await sessions.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(data.sessionId) },
            {
              $addToSet: {
                socials: { name: data.type, date: new Date().getTime() },
              },
            }
          );
          await updateVideoState(data.sessionId, data.type, 'completed');
          fs.unlinkSync(`./tmp/${data.session.slug}.mp4`);
          logger.info('Video upload completed');
        } catch (e) {
          logger.error('Error', e);
          const errorCode = errorMessageToStatusCode(e.message);
          if (errorCode === 401) {
            await updateVideoState(data.sessionId, data.type, 'failed');
          } else {
            await updateVideoState(data.sessionId, data.type, 'failed');
          }
        }
      },
      {
        noAck: true,
      }
    );
  } catch (e) {
    logger.error('error', e);
  }
}

videoUploader();
