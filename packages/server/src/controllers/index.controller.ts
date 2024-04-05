import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags, Body, Post, Header } from 'tsoa';
import startAITools from '@aitools/main';
import { validateWebhook } from '@utils/validateWebhook';
import StageService from '@services/stage.service';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  private stageService = new StageService();
  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }
  @Post('/webhook')
  async webhook(
    @Header('livepeer-signature') livepeerSignature: string,
    @Body() payload: any,
  ): Promise<IStandardResponse<string>> {
    try {
      const webhookAuth = validateWebhook(livepeerSignature, payload);

      if (!webhookAuth) {
        console.log('Invalid signature or timestamp');
        return SendApiResponse('Invalid signature or timestamp', null, '401');
      }
      switch (payload.event) {
        case 'asset.ready':
          await startAITools(payload.payload.id);
          break;
        case 'stream.started':
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;
        default:
          break;
      }
      return SendApiResponse('OK');
    } catch (err) {
      console.log(err);
      return SendApiResponse(err.toString(), null, '500');
    }
  }
}
