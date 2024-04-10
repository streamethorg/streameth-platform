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
  private sessionService = new SessionServcie();
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
        case LivepeerEvent.assetReady:
          const asset = await getAsset(payload.payload.id);
          const session = await this.sessionService.findOne({
            assetId: asset.id,
          });
          if (!session) {
            return SendApiResponse('No session found', null, '400');
          }
          await this.sessionService.update(session._id.toString(), {
            ipfsURI: asset.storage?.ipfs?.cid,
            videoUrl: asset.playbackUrl,
          } as any);
          break;
        case LivepeerEvent.streamStarted:
        case LivepeerEvent.streamIdle:
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;
        case LivepeerEvent.recordingReady:
          await this.sessionService.createStreamRecordings(
            payload.payload.session,
          );
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
