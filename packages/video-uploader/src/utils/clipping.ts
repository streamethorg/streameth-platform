import { exec } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs';
import { Livepeer } from 'livepeer';
import { ObjectId } from 'mongodb';
import path from 'path';
import { Upload } from 'tus-js-client';
import db from './db';
import { ensureDirectoryExists } from './helper';
import { logger } from './logger';
import { Segment, SessionPayload } from './types';
config();

const sessions = db.collection('sessions');
const states = db.collection('states');

async function trim(
  inputUrl: string,
  outputFilePath: string,
  segment: Segment,
): Promise<void> {
  console.info('Trimming segment:', segment);
  const { startTime, endTime, fileName } = segment;
  await ensureDirectoryExists(outputFilePath);
  const outputFile = path.join(outputFilePath, fileName);

  if (fs.existsSync(outputFile)) {
    console.info(`File ${fileName} already exists.`);
    return;
  }

  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${inputUrl}" -ss ${startTime} -to ${endTime} -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k -movflags +faststart ${outputFile}`;
    logger.info(`Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        logger.error(`FFmpeg stderr: ${stderr}`);
      }
      logger.info(`FFmpeg stdout: ${stdout}`);
      logger.info('Video trimming completed successfully.');
      resolve();
    });
  });
}

async function createAsset(fileName: string) {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  });
  const result = await livepeer.asset.create({
    name: fileName,
  });
  const data = JSON.parse(result.rawResponse.data.toString());
  return data;
}

async function updateSessionState(data: SessionPayload) {
  try {
    await sessions.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(data.sessionId) },
      {
        $set: {
          assetId: data.assetId,
        },
      },
    );
  } catch (e) {
    logger.error({
      message: e.message,
    });
  }
}

async function uploadVideo(
  filename: string,
  outputPath: string,
  url: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      endpoint: url,
      uploadSize: fs.statSync(outputPath).size,
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      },
      metadata: {
        filename: filename,
        filetype: 'video/mp4',
      },
      onError: function (error) {
        logger.info('Failed because: ' + error);
        reject(error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        logger.info(percentage + '%');
      },
      onSuccess: function () {
        logger.info('Upload completed for %s', filename);
        resolve();
      },
    };
    const upload = new Upload(fs.createReadStream(outputPath), options);
    upload.start();
  });
}

export async function clipVideo(data: SessionPayload): Promise<void> {
  try {
    await trim(data.m3u8Url, './tmp', {
      fileName: data.fileName,
      startTime: data.start,
      endTime: data.end,
    });
    const asset = await createAsset(data.fileName);
    await updateSessionState({ ...data, assetId: asset.asset.id });
    await uploadVideo(
      data.fileName,
      `./tmp/${data.fileName}`,
      asset.tusEndpoint,
    );
    await fs.unlinkSync(`./tmp/${data.fileName}`);
    logger.info('Video completed successfully.');
  } catch (e) {
    logger.error({
      message: e.message,
    });
  }
}
