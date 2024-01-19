import { Livepeer } from "livepeer";

export const livepeer = new Livepeer({
  apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY, // Your API key
});