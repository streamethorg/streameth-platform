import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Controller,
  Get,
  Route,
  Tags,
  Body,
  Post,
  Header,
  UploadedFile,
  FormField,
  Security,
} from 'tsoa';
import startAITools from '@aitools/main';
import { validateWebhook } from '@utils/validateWebhook';
import StageService from '@services/stage.service';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import SessionService from '@services/session.service';
import { getAsset, updateAsset } from '@utils/livepeer';
import StateService from '@services/state.service';
import { StateStatus } from '@interfaces/state.interface';
import StorageService from '@utils/s3';
import { HttpException } from '@exceptions/HttpException';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  private stageService = new StageService();
  private sessionService = new SessionService();
  private stateService = new StateService();
  private storageService = new StorageService();

  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }

  @Security('jwt')
  @Post('/upload')
  async uploadImges(
    @UploadedFile() file: Express.Multer.File,
    @FormField() directory: string,
  ): Promise<IStandardResponse<string>> {
    if (!file) throw new HttpException(400, 'no or invalid image');
    const image = await this.storageService.uploadFile(
      `${directory}/${file.originalname}`,
      file.buffer,
      file.mimetype,
    );
    return SendApiResponse('image uploaded', image);
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
          await this.assetReady(payload.payload.id);
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
          return SendApiResponse('Event not recognizable', null, '400');
      }
      return SendApiResponse('OK');
    } catch (err) {
      console.log(err);
      return SendApiResponse(err.toString(), null, '500');
    }
  }

  private async assetReady(id: string) {
    const asset = await getAsset(id);
    const session = await this.sessionService.findOne({
      assetId: asset.id,
    });

    if (!session) {
      return SendApiResponse('No session found', null, '400');
    }
    const ipfs = await updateAsset(id);
    await this.sessionService.update(session._id.toString(), {
      ipfsURI: ipfs,
      videoUrl: asset.playbackUrl,
      playbackId: asset.playbackId,
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
  }
}
