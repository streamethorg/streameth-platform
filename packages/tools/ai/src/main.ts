import { createSummary } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { downloadFile } from "../../../av-tools/src/utils/ffmpeg";

async function startCreatingSummary(assetId: string) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetInfo || !assetId) {
    console.log("Asset does not exist");
    return;
  }

  console.log(assetInfo);

  const downloadUrl = assetInfo.downloadUrl || "";
  downloadFile(downloadUrl, "../../tmp/");
  await createSummary(".");
  console.log(downloadUrl);
}

export default startCreatingSummary;
