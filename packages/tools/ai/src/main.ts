import { createSummary, createTranscription } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { ToMp3, downloadM3U8ToMP4 } from "../../../av-tools/src/utils/ffmpeg";
import * as fs from "fs";

async function isUploadedOnDigitalOcean(fileName: string) {}

async function startCreatingSummary(assetId: string) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || !assetId) {
    console.log("Asset does not exist");
    return;
  }

  console.log(assetInfo);
  const downloadUrl = assetInfo.playbackUrl || "";

  await downloadM3U8ToMP4(downloadUrl, assetInfo.id, "./tmp/video/");
  await ToMp3(assetInfo.id, "./tmp/video/", "./tmp/mp3/", 3);

  await createTranscription(
    `./tmp/mp3/${assetInfo.id}.mp3`,
    `./tmp/transcriptions/`,
    `${assetInfo.id}.txt`
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
