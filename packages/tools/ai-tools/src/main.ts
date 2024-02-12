import { createLabels, createSummary, createTranscription } from "./ai";
import { getAssetInfo } from "@avtools/livepeer";
import { downloadM3U8ToMP3 } from "@avtools/ffmpeg";
import S3Service from "@app/lib/services/spacesService";
import SessionService from "@server/services/session.service";
import * as fs from "fs";
import { join } from "path";

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

async function startAITools(
  assetId: string,
  overwriteFiles = false,
  keepTmp = false
) {
  if (!process.env.BUCKET_NAME) {
    throw new Error(
      `BUCKET_NAME does not exist. What NODE_ENV are you running? NODE_ENV: ${process.env.NODE_ENV}`
    );
  }

  if (!assetId) {
    throw new Error("Invalid asset ID");
  }

  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || assetInfo.statusCode !== 200) {
    throw new Error("Asset does not exist");
  }

  const sessionService = new SessionService();
  const { sessions } = await sessionService.getAll({
    assetId: assetInfo.asset!.id!,
  } as any);
  if (sessions.length !== 1) {
    throw new Error("Something went wrong when fetching the correct session");
  }
  const session = sessions[0];
  const sessionId = session._id.toString();

  const mp3FilePath = join(TMP_MP3_PATH, `${sessionId}.mp3`);
  const transcriptionFilePath = join(
    TMP_TRANSCRIPTIONS_PATH,
    `${sessionId}.txt`
  );
  const digitalOceanPath = join(TRANSCRIPTIONS_PATH, `${sessionId}.txt`);

  const s3 = new S3Service();
  const data = await s3.getObject(process.env.BUCKET_NAME, digitalOceanPath);
  if (data && !overwriteFiles) {
    throw new Error("File already exists on Digital Ocean");
  }

  const downloadUrl = assetInfo.asset?.playbackUrl;
  await downloadM3U8ToMP3(downloadUrl!, sessionId, TMP_MP3_PATH, 9);

  const size = await getFileSize(mp3FilePath);
  if (size >= 25000000) {
    throw new Error("Audio file too big");
  }

  await createTranscription(
    mp3FilePath,
    TMP_TRANSCRIPTIONS_PATH,
    `${sessionId}.txt`
  );

  if (!fs.existsSync(transcriptionFilePath)) {
    throw new Error(`${transcriptionFilePath} does not exist...`);
  }

  const fileStream = fs.createReadStream(transcriptionFilePath);
  await s3.uploadFile(
    process.env.BUCKET_NAME,
    digitalOceanPath,
    fileStream,
    "text/plain"
  );

  const labels = await createLabels(transcriptionFilePath);
  const summary = await createSummary(
    transcriptionFilePath,
    TMP_SUMMARY_PATH,
    `summary-${sessionId}.txt`
  );

  await sessionService.update(sessionId, {
    videoTranscription: `${process.env.BUCKET_URL}/transcriptions/${sessionId}.txt`,
    aiDescription: summary,
    autoLabels: labels,
  } as any);

  if (keepTmp === false) {
    fs.rmSync("./tmp", { recursive: true, force: true });
  }
}

// startAITools("7a79da4e-19d4-44e1-9600-e4f927c47af9", true)
//   .then(() => console.log("Ran successfully..."))
//   .catch((err) => console.error("Error:", err));

export default startAITools;
