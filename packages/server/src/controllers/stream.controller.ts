import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { createAsset, getStreamInfo, getPlayback } from '@utils/livepeer';
import {
  Tags,
  Route,
  Controller,
  Body,
  Post,
  SuccessResponse,
  Get,
  Path,
} from 'tsoa';

@Tags('Stream')
@Route('streams')
export class StreamController extends Controller {
  @SuccessResponse('201')
  @Post('asset')
  async createAsset(
    @Body() body: any,
  ): Promise<IStandardResponse<{ url: string; assetId: string }>> {
    return SendApiResponse('Asset created', await createAsset(body));
  }

  @SuccessResponse('200')
  @Get('{streamId}')
  async getStream(@Path() streamId: string): Promise<IStandardResponse<any>> {
    return SendApiResponse('Stream fetched', await getStreamInfo(streamId));
  }

  @SuccessResponse('200')
  @Get('asset/{assetId}')
  async getVideoUrl(
    @Path() assetId: string,
  ): Promise<IStandardResponse<string>> {
    return SendApiResponse('Playback fetched', await getPlayback(assetId));
  }
}
