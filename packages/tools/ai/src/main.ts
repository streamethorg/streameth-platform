import { createSummary } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { downloadM3U8ToMP4 } from "../../../av-tools/src/utils/ffmpeg";

// https://lp-playback.com/hls/1051kh7p17jz1q5a/1080p0.mp4
function replaceUrl(originalUrl: string): string {
  const baseUrl = "https://lp-playback.com/hls/";
  const regex = new RegExp(`${baseUrl}(.+)/video`);

  const match = originalUrl.match(regex);
  if (match && match[1]) {
    return `${baseUrl}${match[1]}/1080p0.mp4`;
  }

  return originalUrl; // Return the original URL if it doesn't match the expected format
}

async function startCreatingSummary(assetId: string) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || !assetId) {
    console.log("Asset does not exist");
    return;
  }

  console.log(assetInfo);
  const downloadUrl = assetInfo.playbackUrl || "";

  // const replacedUrl = replaceUrl(downloadUrl);
  await downloadM3U8ToMP4(downloadUrl, assetInfo.id, "./tmp");
  console.log("downloade File");
  await createSummary(".");
  console.log(downloadUrl);
}

startCreatingSummary("df8b7ce1-0d00-4bd0-abd9-234a6e286236")
  .then(() => {
    console.log("Ran succesfully...");
  })
  .catch((err) => {
    console.log(err);
  });

export default startCreatingSummary;
