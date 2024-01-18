import { createSummary, createTranscription } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { ToMp3, downloadM3U8ToMP4 } from "../../../av-tools/src/utils/ffmpeg";
import * as fs from "fs";

async function startCreatingSummary(assetId: string) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || !assetId) {
    console.log("Asset does not exist");
    return;
  }

  console.log(assetInfo);
  const downloadUrl = assetInfo.playbackUrl || "";

  await downloadM3U8ToMP4(downloadUrl, assetInfo.id, "./tmp/video/");

  // TODO: Stream mp3, instead of mp4 to reduce bandwidth
  // const readStream = fs.createReadStream(`./tmp/video/${assetInfo.id}.mp4`);
  // await ToMp3(assetInfo.id, readStream, "./tmp/mp3/");

  await createTranscription(
    `./tmp/video/${assetInfo.id}.mp4`,
    `./tmp/transcriptions/`,
    `${assetInfo.id}.txt`
  );
  await createSummary("./tmp/summary/", `summary-${assetInfo.id}.txt`);
}

startCreatingSummary("df8b7ce1-0d00-4bd0-abd9-234a6e286236")
  .then(() => {
    console.log("Ran succesfully...");
  })
  .catch((err) => {
    console.log(err);
  });

export default startCreatingSummary;
