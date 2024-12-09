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
  WEBHOOK_SECRET,
  WEBHOOK_URL,
} from "../../../../config.mjs";
import { executeApi } from "../../../../helpers/api-response";
import { RenderRequest } from "../../../../types/schema";

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
	RenderRequest,
	async (req, body) => {
		if (
			!process.env.AWS_ACCESS_KEY_ID &&
			!process.env.REMOTION_AWS_ACCESS_KEY_ID
		) {
			throw new TypeError(
				"Set up Remotion Lambda to render videos. See the README.md for how to do so.",
			);
		}
		if (
			!process.env.AWS_SECRET_ACCESS_KEY &&
			!process.env.REMOTION_AWS_SECRET_ACCESS_KEY
		) {
			throw new TypeError(
				"The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file.",
			);
		}

		// Add webhook configuration
		const webhook = {
			url: WEBHOOK_URL,
			secret: WEBHOOK_SECRET,
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

		return result;
	},
);
