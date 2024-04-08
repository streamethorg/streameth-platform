import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags, Body, Post, Header } from 'tsoa';
import startAITools from '@aitools/main';
import { validateWebhook } from '@utils/validateWebhook';
import StageService from '@services/stage.service';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import SessionServcie from '@services/session.service';
import { getAsset } from '@utils/livepeer';
import StateService from '@services/state.service';
import { StateStatus } from '@interfaces/state.interface';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  private stageService = new StageService();
  private stateService = new StateService();

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

      console.log('hi');
      switch (payload.event) {
        case LivepeerEvent.assetReady:
          const sessionService = new SessionServcie();
          const asset = await getAsset(payload.payload.id);
          const { sessions } = await sessionService.getAll({
            assetId: asset.id,
          } as any);

          console.log(sessions);
          if (!sessions || sessions.length === 0 || sessions.length > 1) {
            return SendApiResponse('No session found', null, '400');
          }

          const session = sessions[0];
          console.log(session);

          await sessionService.update(session._id.toString(), {
            ipfsURI: asset.storage?.ipfs?.cid,
            videoUrl: asset.playbackUrl,
          } as any);

          const state = await this.stateService.getAll({
            sessionId: session._id.toString(),
          });

          if (!state || state.length === 0) {
            return SendApiResponse('No state found', null, '400');
          }
          await this.stateService.update(state[0]._id.toString(), {
            status: StateStatus.completed,
          });

          // await startAITools(payload.payload.id);
          break;
        case LivepeerEvent.streamStarted:
          break;
        case LivepeerEvent.streamIdle:
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;
        default:
          return SendApiResponse('Event not recognizable', null, '400');
      }

      console.log('Done');
      return SendApiResponse('OK');
    } catch (err) {
      console.log(err);
      return SendApiResponse(err.toString(), null, '500');
    }
  }
}
