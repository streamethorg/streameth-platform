import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags, Body, Post, Header } from 'tsoa';
import startAITools from '@aitools/main';
import { validateWebhook } from '@utils/validateWebhook';
import StageService from '@services/stage.service';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import SessionServcie from '@services/session.service';
import { getAsset } from '@utils/livepeer';

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
    @Header('Livepeer-Signature') livepeerSignature: string,
    @Body() payload: any,
  ): Promise<IStandardResponse<string>> {
    try {
      const webhookAuth = validateWebhook(livepeerSignature, payload);
      console.log(payload);

      if (!webhookAuth) {
        console.log('Invalid signature or timestamp');
        return SendApiResponse('Invalid signature or timestamp', null, '401');
      }
      switch (payload.event) {
        case LivepeerEvent.assetReady:
          const sessionService = new SessionServcie();
          const asset = await getAsset(payload.payload.id);
          const { sessions } = await sessionService.getAll({
            assetId: asset.id,
          } as any);
  
          if (!sessions || sessions.length === 0 || sessions.length > 1) {
            return SendApiResponse('No session found', null, '400');
          }
  
          const session = sessions[0];
  
          await sessionService.update(session._id.toString(), {
            ipfsURI: asset.storage?.ipfs?.cid,
            videoUrl: asset.playbackUrl,
          } as any);

          // await startAITools(payload.payload.id);
          break;
        case LivepeerEvent.streamReady:
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
