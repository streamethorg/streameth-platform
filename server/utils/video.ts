import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import path from "path";
import fs from "fs";

export async function extractFirstFrame(hlsUrl: string, filePath: string) {
  console.log(hlsUrl, filePath);
  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log("File already exists, skipping frame extraction.");
    return;
  }
  // replace index.m3u8 with 720p0/index.m3u8
  hlsUrl = hlsUrl.replace("index.m3u8", "source.m3u8");
  let response = await axios.get(hlsUrl);

  const body = response.data;
  const lines = body.split("\n");
  const tsUrl = lines.find((line: string) => line.endsWith(".ts"));

  if (!tsUrl) {
    throw new Error("No .ts URL found in HLS stream");
  }

  console.log("TSURL", tsUrl);
  const tsAbsoluteUrl = path.join(tsUrl);

  ffmpeg(tsAbsoluteUrl)
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .screenshots({
      count: 1,
      filename: filePath,
      timestamps: ["80%"],
      size: "1920x1080",
    })
    .on("end", function () {
      console.log("Frames: extracted");
    })
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    });
}
