import { CreateClipDto } from '@dtos/stream/create-clip.dto';
import { CreateMultiStreamDto } from '@dtos/stream/create-multistream.dto';
import { DeleteMultiStreamDto } from '@dtos/stream/delete-multistream.dto';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  createAsset,
  getStreamInfo,
  createMultiStream,
  deleteMultiStream,
  getDownloadUrl,
  createClip,
  getSessionMetrics,
  getStreamRecordings,
  uploadToIpfs,
  getAsset,
  generateThumbnail,
  getVideoPhaseAction,
} from '@utils/livepeer';
import {
  Tags,
  Route,
  Controller,
  Body,
  Post,
  SuccessResponse,
  Get,
  Path,
  Delete,
  Security,
} from 'tsoa';

@Tags('Stream')
@Route('streams')
export class StreamController extends Controller {
  /**
   * @summary  Create Multistream
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('multistream')
  async createMultiStream(
    @Body() body: CreateMultiStreamDto,
  ): Promise<IStandardResponse<any>> {
    return SendApiResponse(
      'Multistream created',
      await createMultiStream(body),
    );
  }

  /**
   * @summary  Delete Multistream
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('multistream')
  async deleteMultiStream(
    @Body() body: DeleteMultiStreamDto,
  ): Promise<IStandardResponse<void>> {
    return SendApiResponse(
      'Multistream deleted',
      await deleteMultiStream(body),
    );
  }

  /**
   * @summary  Create stream asset
   */
  @SuccessResponse('201')
  @Post('asset')
  async createAsset(
    @Body() body: any,
  ): Promise<IStandardResponse<{ url: string; assetId: string }>> {
    return SendApiResponse('Asset created', await createAsset(body.fileName));
  }

  /**
   * @summary  Get Stream
   */
  @SuccessResponse('200')
  @Get('{streamId}')
  async getStream(@Path() streamId: string): Promise<IStandardResponse<any>> {
    return SendApiResponse('Stream fetched', await getStreamInfo(streamId));
  }

  /**
   * @summary  Get Asset
   */
  @SuccessResponse('200')
  @Get('asset/{assetId}')
  async getAsset(@Path() assetId: string): Promise<IStandardResponse<any>> {
    return SendApiResponse('Asset fetched', await getAsset(assetId));
  }

  /**
   * @summary  Get Video url
   */
  @SuccessResponse('200')
  @Get('asset/url/{assetId}')
  async getVideoUrl(
    @Path() assetId: string,
  ): Promise<IStandardResponse<string>> {
    return SendApiResponse('Video url fetched', await getDownloadUrl(assetId));
  }

  /**
   * @summary  Get Video Phase Action
   */
  @SuccessResponse('200')
  @Get('asset/phase-action/{assetId}')
  async getPhaseAction(
    @Path() assetId: string,
  ): Promise<IStandardResponse<{ playbackUrl: string; phaseStatus: string }>> {
    const phaseAction = await getVideoPhaseAction(assetId);
    return SendApiResponse('phase status fetched', phaseAction);
  }

  /**
   * @summary  Get stream metrics
   */
  @SuccessResponse('200')
  @Get('metric/{playbackId}')
  async getSessionMetrics(
    @Path() playbackId: string,
  ): Promise<IStandardResponse<{ viewCount: number; playTimeMins: number }>> {
    return SendApiResponse(
      'Stream metrics',
      await getSessionMetrics(playbackId),
    );
  }

  /**
   * @summary  Get stream recordings
   */
  @SuccessResponse('200')
  @Get('recording/{streamId}')
  async getStreamRecordings(
    @Path() streamId: string,
  ): Promise<IStandardResponse<any>> {
    return SendApiResponse(
      'Stream recordings',
      await getStreamRecordings(streamId),
    );
  }

  /**
   * @summary  Upload
   */
  @SuccessResponse('200')
  @Get('upload/{assetId}')
  async uploadToIpfs(
    @Path() assetId: string,
  ): Promise<IStandardResponse<string>> {
    return SendApiResponse('Upload', await uploadToIpfs(assetId));
  }

  /**
   * @summary  Create clip
   */
  @SuccessResponse('201')
  @Post('clip')
  async createClip(
    @Body() body: CreateClipDto,
  ): Promise<IStandardResponse<any>> {
    const clip = await createClip(body);
    return SendApiResponse('clipped', clip);
  }

  /**
   * @summary  Generate thumbnail
   */
  @SuccessResponse('201')
  @Post('thumbnail/generate')
  async generateThumbnail(@Body() body: any): Promise<IStandardResponse<any>> {
    const thumbnail = await generateThumbnail({
      assetId: body.assetId,
      playbackId: body.playbackId,
    });
    return SendApiResponse('thumbnail generated', thumbnail);
  }
}
