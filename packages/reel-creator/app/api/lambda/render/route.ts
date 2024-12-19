import type {
  AwsRegion,
  RenderMediaOnLambdaOutput,
} from "@remotion/lambda/client";
import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
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
import { executeApi } from "../../../../helpers/api-response";
import { RenderRequest } from "../../../../types/schema";

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
	RenderRequest,
	async (req, body) => {
		if (
			!AWS_ACCESS_KEY_ID_FILE ||
			!AWS_SECRET_ACCESS_KEY_FILE ||
			!SERVER_WEBHOOK_URL ||
			!SERVER_WEBHOOK_SECRET_FILE ||
			!SITE_NAME
		) {
			throw new TypeError(
				"Set up Remotion Lambda to render videos. See the README.md for how to do so.",
			);
		}

    // set REMOTION_AWS_SECRET_ACCESS_KEY env
    process.env.REMOTION_AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY_FILE;
    // set REMOTION_AWS_ACCESS_KEY_ID env
    process.env.REMOTION_AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID_FILE;

		// Add webhook configuration
		const webhook = {
			url: SERVER_WEBHOOK_URL,
			secret: SERVER_WEBHOOK_SECRET_FILE,
			customData: {
				compositionId: body.id, // Add custom data here.
			},
		};

		// run
		const result = await renderMediaOnLambda({
			codec: "h264",
      timeoutInMilliseconds: 900000,
			functionName: speculateFunctionName({
				diskSizeInMb: DISK,
				memorySizeInMb: RAM,
				timeoutInSeconds: TIMEOUT,
			}),
			region: REGION as AwsRegion,
			serveUrl: SITE_NAME,
			composition: body.id,
			inputProps: body.inputProps,
			downloadBehavior: {
				type: "download",
				fileName: "video.mp4",
			},
			webhook,
		});

		console.log("secrets", AWS_ACCESS_KEY_ID_FILE, AWS_SECRET_ACCESS_KEY_FILE, SERVER_WEBHOOK_SECRET_FILE, SERVER_WEBHOOK_URL, SITE_NAME);

		return result;
	},
);
