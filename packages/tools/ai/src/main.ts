import { createSummary, createTranscription } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { downloadM3U8ToMP3 } from "../../../av-tools/src/utils/ffmpeg";
import S3Client from "../../../server/services/s3/index.ts";
import * as fs from "fs";

const BUCKET_NAME = "streamethapp";
const TRANSCRIPTIONS_PATH = "transcriptions/";
const TMP_MP3_PATH = "./tmp/mp3/";
const TMP_TRANSCRIPTIONS_PATH = "./tmp/transcriptions/";
const TMP_SUMMARY_PATH = "./tmp/summary/";

async function getFileSize(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats.size);
    });
  });
}

async function startCreatingSummary(assetId: string, overwriteFiles = false) {
  if (!assetId) {
    console.log("Invalid asset ID");
    return;
  }

  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo) {
    console.log("Asset does not exist");
    return;
  }

  const s3 = new S3Client();
  const data = await s3.getBucket(
    BUCKET_NAME,
    `${TRANSCRIPTIONS_PATH}${assetInfo.id}.txt`
  );

  if (Object.keys(data).length !== 0 && !overwriteFiles) {
    console.log("File already exists");
    return;
  }

  const downloadUrl = assetInfo.playbackUrl || "";
  await downloadM3U8ToMP3(downloadUrl, assetInfo.id, TMP_MP3_PATH, 9);

  const mp3FilePath = `${TMP_MP3_PATH}${assetInfo.id}.mp3`;
  const size = await getFileSize(mp3FilePath);
  if (size >= 25000000) {
    console.log("Audio file too big... Cancelling...");
    return;
  }

  await createTranscription(
    mp3FilePath,
    TMP_TRANSCRIPTIONS_PATH,
    `${assetInfo.id}.txt`
  );

  const transcriptionFilePath = `${TMP_TRANSCRIPTIONS_PATH}${assetInfo.id}.txt`;
  if (!fs.existsSync(transcriptionFilePath)) {
    console.log(`${transcriptionFilePath} does not exist...`);
    return;
  }

  const fileStream = fs.createReadStream(transcriptionFilePath);
  await s3.uploadFile(
    BUCKET_NAME,
    `${TRANSCRIPTIONS_PATH}${assetInfo.id}.txt`,
    fileStream,
    "text/plain"
  );

  // TODO: Add labels

  await createSummary(
    transcriptionFilePath,
    TMP_SUMMARY_PATH,
    `summary-${assetInfo.id}.txt`
  );

  // TODO: Put summary on MongoDB & delete tmp
}

startCreatingSummary("67243415-8c98-4adf-b2ff-383a44bcddc7")
  .then(() => console.log("Ran successfully..."))
  .catch((err) => console.error("Error:", err));

export default startCreatingSummary;
