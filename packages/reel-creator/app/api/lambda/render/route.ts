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
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from "../../../../config.mjs";
import { executeApi } from "../../../../helpers/api-response";
import { RenderRequest } from "../../../../types/schema";

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
	RenderRequest,
	async (req, body) => {
		if (
			!AWS_ACCESS_KEY_ID ||
			!AWS_SECRET_ACCESS_KEY ||
			!WEBHOOK_URL ||
			!WEBHOOK_SECRET ||
			!SITE_NAME
		) {
			throw new TypeError(
				"Set up Remotion Lambda to render videos. See the README.md for how to do so.",
			);
		}

    // set REMOTION_AWS_SECRET_ACCESS_KEY env
    process.env.REMOTION_AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
    process.env.REMOTION_AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
    console.log("🔑 AWS credentials set for Lambda rendering");

		// Add webhook configuration
		const webhook = {
			url: WEBHOOK_URL,
			secret: WEBHOOK_SECRET,
			customData: {
				compositionId: body.id,
			},
		};

		// Set a fixed framesPerLambda to control concurrency
		// Higher value = fewer concurrent Lambdas
		// Example: with 300 frames total:
		// - framesPerLambda = 30 → 10 concurrent Lambdas
		// - framesPerLambda = 60 → 5 concurrent Lambdas
		// const framesPerLambda = 630; // Adjust this value to control concurrency

		// console.log("\n🎯 Lambda Configuration:", {
		// 	framesPerLambda,
		// 	maxPossibleConcurrency: Math.ceil(108402 / framesPerLambda), // 
		// 	note: "Actual concurrency will depend on total frames in the video"
		// });

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
			// framesPerLambda,
		});
		console.log("✨ Render media on Lambda initiated");
		console.log("📝 Lambda render details:", {
			renderId: result.renderId,
			bucketName: result.bucketName,
		});

		return result;
	},
);
