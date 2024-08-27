import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { logger } from "./logger";
config();

interface ChunkTypes {
  text: string;
  timestamp: Array<number>;
}

export interface ChunkDataTypes {
  chunks: Array<ChunkTypes>;
  text: string;
}

const convertToVttTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(6, "0")}`;
};

export const jsonToVtt = ({ chunks }: ChunkDataTypes): string => {
  const header = "WEBVTT";
  const body = chunks
    .map(
      ({ timestamp: [start, end], text }) =>
        `${convertToVttTimestamp(start)} --> ${convertToVttTimestamp(end)}
  ${text.trim()}`,
    )
    .join("\n\n");
  return `${header}\n\n${body}`;
};

export const uploadFile = async (
  filename: string,
  file: string,
): Promise<string> => {
  try {
    const s3 = new S3({
      endpoint: "https://ams3.digitaloceanspaces.com",
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY ?? "",
        secretAccessKey: process.env.SPACES_SECRET ?? "",
      },
    });
    const params: PutObjectCommandInput = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: file,
      ContentType: "text/vtt",
      ACL: "public-read",
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `${process.env.BUCKET_URL}/${filename}`;
  } catch (e) {
    logger.error(e);
  }
};