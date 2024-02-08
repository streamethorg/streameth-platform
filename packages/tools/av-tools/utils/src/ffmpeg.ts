import { createReadStream } from "fs";
import { join } from "path";
import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export function ToStream(filepath: string) {
  return createReadStream(filepath, { encoding: "utf8" });
}

export function downloadM3U8ToMP4(
  m3u8Url: string,
  fileName: string,
  outputFilePath: string
): Promise<void> {
  if (!fs.existsSync(outputFilePath)) {
    console.log("Creating tmp folder...");
    fs.mkdirSync(outputFilePath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    if (fs.existsSync(join(outputFilePath, `${fileName}.mp4`))) {
      console.log(`File ${fileName}.mp4 already exists...`);
      resolve();
      return;
    }
    console.log(`Downloading ${m3u8Url}...`);

    ffmpeg(m3u8Url)
      .output(join(outputFilePath, `${fileName}.mp4`))
      .on("end", () => {
        console.log("Download and conversion completed");
        resolve();
      })
      .on("error", (err: any) => {
        console.error("Error:", err);
        reject(err);
      })
      .run();
  });
}

export function downloadM3U8ToMP3(
  m3u8Url: string,
  fileName: string,
  outputFilePath: string,
  audioQuality: number = 5
): Promise<void> {
  if (!fs.existsSync(outputFilePath)) {
    console.log("Creating tmp folder...");
    fs.mkdirSync(outputFilePath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    if (fs.existsSync(join(outputFilePath, `${fileName}.mp3`))) {
      console.log(`File ${fileName}.mp3 already exists...`);
      resolve();
      return;
    }
    console.log(`Downloading ${m3u8Url}...`);

    ffmpeg(m3u8Url)
      .audioQuality(audioQuality)
      .output(join(outputFilePath, `${fileName}.mp3`))
      .format("mp3")
      .on("end", () => {
        console.log("Download and conversion completed");
        resolve();
      })
      .on("error", (err: any) => {
        console.error("Error:", err);
        reject(err);
      })
      .run();
  });
}

export async function ToMp3(
  fileName: string,
  inputFilePath: string,
  outputFilePath: string
): Promise<void> {
  const filePath = join(inputFilePath, `${fileName}.mp4`);
  const mp3FilePath = join(outputFilePath, `${fileName}.mp3`);

  if (fs.existsSync(mp3FilePath)) {
    console.log(`File ${mp3FilePath} already exists...`);
    return;
  }

  console.log("Convert to mp3", fileName);

  if (!fs.existsSync(outputFilePath)) {
    fs.mkdirSync(outputFilePath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .save(mp3FilePath)
      .format("mp3")
      .on("end", () => {
        console.log(`Conversion to mp3 completed: ${mp3FilePath}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error converting to mp3: ${fileName}`, err);
        reject(err);
      });
  });
}
