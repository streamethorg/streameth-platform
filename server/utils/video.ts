import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import fs from "fs";

export async function extractFirstFrame(hlsUrl: string, filePath: string) {
  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log("File already exists, skipping frame extraction.");
    return;
  }
  // replace index.m3u8 with 720p0/index.m3u8
  // hlsUrl = hlsUrl.replace("index.m3u8", "index1080p0.m3u8");
  let response = await axios.get(hlsUrl);

  const body = response.data;
  const lines = body.split("\n");
  const tsUrl = lines.find((line: string) => line.endsWith(".ts"));

  // if (!tsUrl) {
  //   throw new Error("No .ts URL found in HLS stream");
  // }
ffmpeg(hlsUrl)
.screenshots({
  timemarks: ['00:00:06.000'],
  filename: filePath, 
  folder: '.',
  size: '1920x1080'
})
.on('end', function() {
  console.log('Screenshots taken');
})
.on('error', function(err) {
  console.log('An error occurred: ' + err.message);
});
}
