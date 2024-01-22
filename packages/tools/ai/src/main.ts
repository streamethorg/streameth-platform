import { createSummary, createTranscription } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { downloadM3U8ToMP3 } from "../../../av-tools/src/utils/ffmpeg";
import S3Client from "../../../server/services/s3/index.ts";
import * as fs from "fs";

async function getFileSize(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject();
      }
      resolve(stats.size);
    });
  });
}

async function startCreatingSummary(assetId: string, overwriteFiles = false) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || !assetId) {
    console.log("Asset does not exist");
    return;
  }

  const s3 = new S3Client();
  const data = await s3.getBucket(
    "streamethapp",
    `transcriptions/${assetInfo.id}.txt`
  );

  if (Object.keys(data).length !== 0 && overwriteFiles === false) {
    console.log("File does already exist");
    return;
  }

  const downloadUrl = assetInfo.playbackUrl || "";
  await downloadM3U8ToMP3(downloadUrl, assetInfo.id, "./tmp/mp3/", 9);

  const size = await getFileSize(`./tmp/mp3/${assetInfo.id}.mp3`);
  if (size >= 25000000) {
    console.log("Audio file too big... Cancelling...");
    return;
  }

  await createTranscription(
    `./tmp/mp3/${assetInfo.id}.mp3`,
    `./tmp/transcriptions/`,
    `${assetInfo.id}.txt`
  );

  if (!fs.existsSync(`./tmp/transcriptions/${assetInfo.id}.txt`)) {
    console.log(`./tmp/transcriptions/${assetInfo.id}.txt does not exist...`);
    return;
  }

  const file = fs.createReadStream(`./tmp/transcriptions/${assetInfo.id}.txt`);
  await s3.uploadFile(
    "streamethapp",
    `transcriptions/${assetInfo.id}.txt`,
    file,
    "text"
  );

  await createSummary(
    `./tmp/transcriptions/${assetInfo.id}.txt`,
    "./tmp/summary/",
    `summary-${assetInfo.id}.txt`
  );
}

// Use this to test AI Script
startCreatingSummary("67243415-8c98-4adf-b2ff-383a44bcddc7")
  .then(() => {
    console.log("Ran succesfully...");
  })
  .catch((err) => {
    console.log(err);
  });

export default startCreatingSummary;
