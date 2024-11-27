import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

import {
  renderMediaOnLambda,
  speculateFunctionName,
  AwsRegion,
  RenderMediaOnLambdaOutput,
  getRenderProgress,
} from "@remotion/lambda/client";
import { config } from '@config';
import { EditorProps } from '@interfaces/remotion.webhook.interface';

@Tags('Remotion')
@Route('remotion')
export class RemotionController extends Controller {
  /**
   * @summary Render video using Remotion Lambda
   */
  @SuccessResponse('201')
  @Post('/render')
  async renderVideo(
    @Body() body: {
      id: string;
      inputProps: EditorProps;
    }
  ): Promise<IStandardResponse<RenderMediaOnLambdaOutput>> {

    try {
      // Add webhook configuration
      const webhook = {
        url: config.remotion.webhook.url,
        secret: config.remotion.webhook.secret,
        customData: {
          compositionId: body.id,
        },
      };

      const result = await renderMediaOnLambda({
        codec: "h264",
        timeoutInMilliseconds: 900000,
        functionName: speculateFunctionName({
          diskSizeInMb: config.remotion.render.diskSizeInMb,
          memorySizeInMb: config.remotion.render.memorySizeInMb,
          timeoutInSeconds: config.remotion.render.timeoutInSeconds,
        }),
        region: config.remotion.aws.region as AwsRegion,
        serveUrl: config.remotion.render.siteName,
        composition: body.id,
        inputProps: body.inputProps as unknown as Record<string, unknown>,
        downloadBehavior: {
          type: "download",
          fileName: "video.mp4",
        },
        webhook,
      });

      return SendApiResponse('Video render initiated successfully', result);
    } catch (error) {
      console.error('Remotion render error:', error);
      this.setStatus(500);
      return SendApiResponse('Failed to initiate video render');
    }
  }

  /**
   * @summary Get render progress from Remotion Lambda
   */
  @Post('/progress')
  async getRenderProgress(
    @Body() body: {
      bucketName: string;
      id: string;
    }
  ): Promise<IStandardResponse<{
    type: 'error' | 'done' | 'progress';
    message?: string;
    url?: string;
    size?: number;
    progress?: number;
  }>> {
    try {
      const renderProgress = await getRenderProgress({
        bucketName: body.bucketName,
        functionName: speculateFunctionName({
          diskSizeInMb: config.remotion.render.diskSizeInMb,
          memorySizeInMb: config.remotion.render.memorySizeInMb,
          timeoutInSeconds: config.remotion.render.timeoutInSeconds,
        }),
        region: config.remotion.aws.region as AwsRegion,
        renderId: body.id,
      });

      if (renderProgress.fatalErrorEncountered) {
        return SendApiResponse('Render error', {
          type: 'error',
          message: renderProgress.errors[0].message,
        });
      }

      if (renderProgress.done) {
        return SendApiResponse('Render complete', {
          type: 'done',
          url: renderProgress.outputFile as string,
          size: renderProgress.outputSizeInBytes as number,
        });
      }

      return SendApiResponse('Render in progress', {
        type: 'progress',
        progress: Math.max(0.03, renderProgress.overallProgress),
      });
    } catch (error) {
      console.error('Remotion progress error:', error);
      this.setStatus(500);
      return SendApiResponse('Failed to get render progress');
    }
  }
}
