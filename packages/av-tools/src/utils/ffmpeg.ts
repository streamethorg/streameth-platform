import { CONFIG, resetTmpFolder } from "./config";
import { createReadStream, existsSync, ReadStream } from "fs";
import * as child from "child_process";
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
    console.log("Creating tmp");
    fs.mkdirSync(outputFilePath, { recursive: true });
  }

  console.log(`Downloading ${m3u8Url}...`);

  return new Promise((resolve, reject) => {
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

export async function ToMp3(
  id: string,
  stream: ReadStream,
  outputFilePath = CONFIG.ASSET_FOLDER,
  bitrate = CONFIG.BITRATE
) {
  console.log("Convert to mp3", id);

  if (!fs.existsSync(outputFilePath)) {
    fs.mkdirSync(outputFilePath, { recursive: true });
  }

  try {
    ffmpeg(stream)
      .audioBitrate(bitrate)
      .format("mp3")
      .save(`${outputFilePath}/${id}.mp3`)
      .on("error", console.error);
  } catch (error) {
    console.log("Unable to convert to mp3", id, error);
  }
}

export async function ToMp4(id: string, stream: ReadStream) {
  console.log("Convert to mp4", id);

  try {
    ffmpeg(stream)
      .format("mp4")
      .save(`${CONFIG.ASSET_FOLDER}/mp4/${id}.mp4`)
      .on("error", console.error);
  } catch (error) {
    console.log("Unable to convert to mp3", id, error);
  }
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
