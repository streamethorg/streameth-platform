import { config } from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import { errorMessageToStatusCode } from './utils/errors';
import { downloadM3U8ToMP3 } from './utils/ffmpeg';
import { jsonToVtt, uploadFile } from './utils/helper';
import { logger } from './utils/logger';
import connection from './utils/mq';
import { ChunkDataTypes, ChunkTypes } from './utils/helper';


config();

const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);
const sessions = db.collection('sessions');
const states = db.collection('states');

const convertAudioToText = async (
  sessionId: string,
  filepath: string
): Promise<{ url: string; text: string; chunks: ChunkTypes[] }> => {
  try {
    logger.info('Converting audio to text');
    const form = new FormData();
    form.append('audio', fs.createReadStream(filepath));
    form.append('model_id', 'openai/whisper-large-v3');
    const response = await fetch(
      `${process.env.LIVEPEER_GATEWAY_URL}/audio-to-text`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_GATEWAY_KEY}`,
          ...form.getHeaders(),
        },
        body: form,
      }
    );
    if (response.status === 400) {
      logger.error('error', {
        status: response.status,
        message: response.statusText,
      });
      throw new Error('audio conversion failed');
    }
    if (response.status === 503) {
      logger.error('error', {
        status: response.status,
        message: response.statusText,
      });
      throw new Error('service unavailable');
    }
    const data: ChunkDataTypes = await response.json() as ChunkDataTypes;
    const transcriptions = jsonToVtt(data);
    const url = await uploadFile(
      `transcriptions/${sessionId}.vtt`,
      transcriptions
    );
    logger.info('Audio to text conversion completed');
    return {
      url: url,
      text: data.text,
      chunks: data.chunks,
    };
  } catch (e) {
    logger.error(e);
  }
};

const updateAudioState = async (sessionId: string, status: string) => {
  const state = await states.findOne({
    sessionId: ObjectId.createFromHexString(sessionId),
    type: 'transcrpition',
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

async function audioConverter() {
  try {
    const queue = 'audio';
    const connectionCue = await connection.getConnection();
    const channel = await connectionCue.createChannel();
    let data;
    
    channel.assertQueue(queue, {
      durable: true,
    });
    
    logger.info(`Audio consumer connected to queue: ${queue}`);
    
    channel.consume(
      queue,
      async (msg) => {
        try {
          const payload = Buffer.from(msg.content).toString();
          data = JSON.parse(payload);
          await downloadM3U8ToMP3(
            data.session.videoUrl,
            data.session.slug,
            './tmp'
          );
          const transcript = await convertAudioToText(
            data.sessionId,
            `./tmp/${data.session.slug}.mp3`
          );
          await sessions.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(data.sessionId) },
            {
              $set: {
                transcripts: {
                  subtitleUrl: transcript.url,
                  chunks: transcript.chunks,
                  text: transcript.text,
                },
              },
            }
          );
          await updateAudioState(data.sessionId, 'completed');
          fs.unlinkSync(`./tmp/${data.session.slug}.mp3`);
          logger.info('Audio conversion completed');
        } catch (e) {
          logger.error('Error', e);
          const errorCode = errorMessageToStatusCode(e.message);
          if ([400, 404, 500, 503].includes(errorCode)) {
            await updateAudioState(data.sessionId, 'failed');
          } else {
            await updateAudioState(data.sessionId, 'failed');
          }
        } finally {
          if (data && fs.existsSync(`./tmp/${data.session.slug}.mp3`)) {
            fs.unlinkSync(`./tmp/${data.session.slug}.mp3`);
          }
        }
      },
      {
        noAck: true,
      }
    );
  } catch (e) {
    logger.error('error', e);
    // Retry connection after delay
    setTimeout(() => {
      logger.info('Retrying audio converter connection...');
      audioConverter();
    }, 5000);
  }
}

// Modify the initialization to handle process errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});

audioConverter();
