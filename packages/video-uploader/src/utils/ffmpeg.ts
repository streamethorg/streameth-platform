import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path, { resolve } from "path";
import { logger } from "./logger";

async function ensureDirectoryExists(directory: string): Promise<void> {
  if (!fs.existsSync(directory)) {
    logger.info(`Creating directory ${directory}...`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

export async function downloadM3U8ToMP4(
  m3u8Url: string,
  fileName: string,
  outputFilePath: string,
): Promise<void> {
  await ensureDirectoryExists(outputFilePath);
  const outputFile = path.join(outputFilePath, `${fileName}.mp4`);

  if (fs.existsSync(outputFile)) {
    console.info(`File ${fileName}.mp4 already exists.`);
    return;
  }
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${m3u8Url}...`);
    ffmpeg(m3u8Url)
      .inputOptions("-protocol_whitelist", "file,http,https,tcp,tls")
      .outputOptions("-c", "copy")
      .on("start", (commandLine) => {
        logger.info("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        logger.info("Processing: " + progress.percent + "% done");
      })
      .on("end", () => {
        logger.info("Processing finished successfully");
        resolve();
      })
      .on("error", (err) => {
        logger.info("An error occurred: " + err.message);
      })
      .save(outputFile);
  });
}

export async function downloadM3U8ToMP3(
  m3u8Url: string,
  fileName: string,
  outputFilePath: string,
) :Promise<void> {
  await ensureDirectoryExists(outputFilePath);
  const outputFile = path.join(outputFilePath, `${fileName}.mp3`);

  if (fs.existsSync(outputFile)) {
    logger.info(`File ${fileName}.mp3 already exists.`);
    return;
  }
  return new Promise((resolve, reject) => {
    ffmpeg(m3u8Url)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .audioChannels(2)
      .audioFrequency(44100)
      .output(outputFile)
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log("Download and conversion completed");
        resolve();
      })
      .on("error", (err: Error) => {
        console.error("An error occurred:", err);
        reject(err);
      })
      .run();
  });
}
