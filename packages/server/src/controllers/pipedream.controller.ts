import { PipedreamUploadDto } from '@dtos/pipedream/pipedream.dto';
import { IPipedreamResponse } from '@interfaces/pipedream.interface';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa';

@Tags('Pipedream')
@Route('pipedream')
export class PipedreamController extends Controller {
  /**
   * @summary Upload to Devcon
   */
  @SuccessResponse('201')
  @Post('/upload')
  async uploadToDevcon(
    @Body() body: PipedreamUploadDto,
  ): Promise<IStandardResponse<IPipedreamResponse>> {
    // console.log('Backend - Received request payload:', body);

    const DEVCON_UPLOAD_ENDPOINT = process.env.DEVCON_UPLOAD_ENDPOINT;
    const PIPEDREAM_AUTH_TOKEN = process.env.PIPEDREAM_AUTH_TOKEN;

    if (!DEVCON_UPLOAD_ENDPOINT || !PIPEDREAM_AUTH_TOKEN) {
      this.setStatus(500);
      return SendApiResponse('Missing required environment variables');
    }

    try {
      const response = await fetch(DEVCON_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PIPEDREAM_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      //   console.log('Backend - Received Pipedream response:', responseData);

      if (responseData.devconUpload?.result !== null) {
        this.setStatus(400);
        return SendApiResponse('Failed to upload to Devcon API');
      }
      if (responseData.video?.status !== 'uploaded') {
        this.setStatus(400);
        return SendApiResponse('Failed to upload video to Devcon YouTube');
      }
      if (responseData.thumbnail?.status !== 200) {
        this.setStatus(400);
        return SendApiResponse('Failed to upload thumbnail to Devcon YouTube');
      }

      return SendApiResponse('Successfully uploaded to Devcon', responseData);
    } catch (error) {
      console.error('Backend - Error:', error);
      this.setStatus(500);
      return SendApiResponse('Internal server error');
    }
  }
}
