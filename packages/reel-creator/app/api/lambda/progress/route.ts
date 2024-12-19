import {
  speculateFunctionName,
  AwsRegion,
  getRenderProgress,
} from "@remotion/lambda/client";
import { executeApi } from "../../../../helpers/api-response";
import { ProgressRequest, ProgressResponse } from "../../../../types/schema";
import {
  DISK,
  RAM,
  REGION,
  SITE_NAME,
  TIMEOUT,
  SERVER_WEBHOOK_SECRET_FILE,
  SERVER_WEBHOOK_URL,
  AWS_ACCESS_KEY_ID_FILE,
  AWS_SECRET_ACCESS_KEY_FILE,
} from "../../../../config.mjs";

export const POST = executeApi<ProgressResponse, typeof ProgressRequest>(
  ProgressRequest,
  async (req, body) => {
    if (
      !AWS_ACCESS_KEY_ID_FILE ||
      !AWS_SECRET_ACCESS_KEY_FILE ||
      !SERVER_WEBHOOK_URL ||
      !SERVER_WEBHOOK_SECRET_FILE ||
      !SITE_NAME
    ) {
      throw new TypeError(
        "Set up Remotion Lambda to render videos. See the README.md for how to do so."
      );
    }

    // set REMOTION_AWS_SECRET_ACCESS_KEY env
    process.env.REMOTION_AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY_FILE;
    // set REMOTION_AWS_ACCESS_KEY_ID env
    process.env.REMOTION_AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID_FILE;

    const renderProgress = await getRenderProgress({
      bucketName: body.bucketName,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      renderId: body.id,
    });

    if (renderProgress.fatalErrorEncountered) {
      return {
        type: "error",
        message: renderProgress.errors[0].message,
      };
    }

    if (renderProgress.done) {
      return {
        type: "done",
        url: renderProgress.outputFile as string,
        size: renderProgress.outputSizeInBytes as number,
      };
    }

    return {
      type: "progress",
      progress: Math.max(0.03, renderProgress.overallProgress),
    };
  }
);
