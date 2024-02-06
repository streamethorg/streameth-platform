import { Livepeer } from "livepeer";

export async function getAssetInfo(assetId: string) {
  if (!process.env.LIVEPEER_API_KEY) {
    console.log("LIVEPEER_API_KEY is not defined");
    return null;
  }

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY || "",
  });

  return livepeer.asset.get(assetId);
}
