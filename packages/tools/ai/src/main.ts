import { createSummary } from "./ai";
import { getAssetInfo } from "../../../av-tools/src/utils/livepeer";
import { downloadVideo } from "../../../av-tools/src/utils/ffmpeg";

async function startCreatingSummary(assetId: string) {
  const assetInfo = await getAssetInfo(assetId);
  if (!assetId) {
    console.log("Asset does not exist");
    return;
  }

  downloadVideo(assetInfo!.downloadUrl, "../../tmp/");
  await createSummary(".");
}

// If you wanna run it like a script
startCreatingSummary()
  .then(() => console.log("Script ran successfully!"))
  .catch((e) => console.log("Something went wrong: ", e));

export default startCreatingSummary;
