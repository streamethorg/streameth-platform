import { CONFIG, resetTmpFolder } from "./config";
import { createReadStream, existsSync, ReadStream } from "fs";
import * as child from "child_process";
import { join, resolve } from "path";
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
  outputFilePath: string,
  bitrate = CONFIG.BITRATE
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

// export async function JoinSessions(sessions: string[]) {
//   console.log('Join', sessions.length, 'sessions')
//
//   for (let i = 0; i < sessions.length; i++) {
//     const id = sessions[i]
//     const introId = id.replace(/["_"]/g, '-')
//     const inputs = []
//
//     if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/intros/${introId}.mp4`)) {
//       inputs.push(`${CONFIG.ASSET_FOLDER}/intros/${introId}.mp4`)
//     }
//     if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`)) {
//       inputs.push(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`)
//     }
//     if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/outros/${id}.mp4`)) {
//       inputs.push(`${CONFIG.ASSET_FOLDER}/outros/${id}.mp4`)
//     }
//
//     if (inputs.length === 0) {
//       console.log('No inputs found', id)
//       continue
//     }
//
//     // if split is found, but no in-/outro move to session folder
//     if (inputs.length === 1 && fs.existsSync(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`)) {
//       console.log('Not enough inputs to join. Moving split video')
//       fs.copyFileSync(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`, `${CONFIG.ASSET_FOLDER}/sessions/${id}.mp4`)
//       continue
//     }
//
//     await Join(inputs, `${CONFIG.ASSET_FOLDER}/sessions/${id}.mp4`)
//   }
// }

export async function Join(inputs: string[], output: string) {
  console.log("Joining videos to", output);
  console.log("Inputs:", inputs);

  if (fs.existsSync(output)) {
    console.log("File already exists", output);
    return;
  }

  await concat({
    output: output,
    videos: inputs,
    frameFormat: "raw",
    tempDir: join(CONFIG.ASSET_FOLDER, "tmp"),
    transition: {
      name: "fade", // Options: fade, directionalwipe, circleopen, squareswire
      duration: 750,
    },
  });

  resetTmpFolder();
}

export async function Split(
  sessions: {
    id: string;
    streamUrl: string;
    start: number;
    end: number;
  }[]
) {
  console.log("Splitting to", sessions.length, "videos");

  for (const session of sessions) {
    const file = `${CONFIG.ASSET_FOLDER}/splits/${session.id}.mp4`;
    const ffmpegPath = ""
    console.log("Split to", session.id, session.start, session.end);

    if (existsSync(file)) {
      console.log("File already exists", file);
      continue;
    }

    // To fix Segmentation fault (core dumped), install nscd
    // `sudo apt install nscd`
    child.execSync(
      `${ffmpegPath ?? "ffmpeg"} -i ${session.streamUrl} -ss ${
        session.start
      } -to ${session.end} -c:v libx264 -c:a copy -y ${file}`,
      {
        stdio: "inherit",
      }
    );

    if (existsSync(file)) {
      console.log("Successfully split", session.id, "at", file);
    }
  }
}
function concat(arg0: {
  output: string; videos: string[]; frameFormat: string; tempDir: string; transition: {
    name: string; // Options: fade, directionalwipe, circleopen, squareswire
    duration: number;
  };
}) {
  throw new Error("Function not implemented.");
}

