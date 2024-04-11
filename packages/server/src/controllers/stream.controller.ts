import { CreateMultiStreamDto } from '@dtos/stream/create-multistream.dto';
import { DeleteMultiStreamDto } from '@dtos/stream/delete-multistream.dto';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  createAsset,
  getStreamInfo,
  getPlayback,
  createMultiStream,
  deleteMultiStream,
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
} from 'tsoa';

@Tags('Stream')
@Route('streams')
export class StreamController extends Controller {
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
