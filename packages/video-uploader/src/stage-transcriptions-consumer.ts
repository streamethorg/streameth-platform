// stage transcriptions consumer
import { stageTranscriptionsQueue } from './utils/redis';
import { MongoClient } from 'mongodb';
import ffmpeg from 'fluent-ffmpeg';

interface StageTranscriptionsJob {
  stageId: string;
}

const consumer = async () => {
  const queue = await stageTranscriptionsQueue;
  queue.process(async (job) => {
    console.log(job.data);
  });
};


async function transcribeAudio(streamId, streamUrl) {
  const mongoClient = new MongoClient('your-mongo-uri');
  await mongoClient.connect();
  const db = mongoClient.db('your-db-name');
  const streamsCollection = db.collection('streams');

  return new Promise((resolve, reject) => {
    const ffmpegProcess = ffmpeg(streamUrl)
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .format('wav')
      .on('data', async (chunk) => {
        try {
          const transcript = await WhisperAPI.transcribe(chunk);
          await streamsCollection.updateOne(
            { _id: streamId },
            { $push: { transcripts: transcript } }
          );
        } catch (err) {
          reject(err);
        }
      })
      .on('end', resolve)
      .on('error', reject)
      .pipe();
  });
}