import { HttpException } from '@exceptions/HttpException';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import { ClippingStatus } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import SessionService from '@services/session.service';
import StageService from '@services/stage.service';
import StateService from '@services/state.service';
import { type IStandardResponse, SendApiResponse } from '@utils/api.response';
import { updateEventVideoById } from '@utils/firebase';
import { getAsset, getDownloadUrl } from '@utils/livepeer';
import StorageService from '@utils/s3';
import { validateWebhook } from '@utils/validateWebhook';
import {
  Body,
  Controller,
  FormField,
  Get,
  Header,
  Post,
  Route,
  Security,
  Tags,
  UploadedFile,
} from 'tsoa';

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
    const timestamp = Date.now().toString();
    const fileName = file.originalname.split('.')[0];
    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${fileName}-${timestamp}.${fileExtension}`;
    const image = await this.storageService.uploadFile(
      `${directory}/${newFileName}`,
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

      console.log('Livepeer Payload:', payload);

      switch (payload.event) {
        case LivepeerEvent.assetReady:
          await this.assetReady(payload.payload.id);
          break;
        case LivepeerEvent.assetFailed:
          await this.assetFailed(payload.payload.id);
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
    const session = await this.sessionService.findOne({ assetId: asset.id });
    if (!session) throw new HttpException(404, 'No session found');
    await this.sessionService.update(session._id.toString(), {
      videoUrl: asset.playbackUrl,
      playbackId: asset.playbackId,
      clippingStatus: ClippingStatus.completed,
    } as any);

    if (session.firebaseId && asset.playbackUrl) {
      await updateEventVideoById(session.firebaseId, {
        url: asset.playbackUrl,
        mp4Url: await getDownloadUrl(asset.id),
      });
    }
    const state = await this.stateService.findOne({
      _id: session._id.toString(),
      type: StateType.video
    });
    if (!state) throw new HttpException(404, 'No state found');
    await this.stateService.update(state._id.toString(), {
      status: StateStatus.completed,
    });
  }

  private async assetFailed(id: string) {
    const asset = await getAsset(id);
    const session = await this.sessionService.findOne({
      assetId: asset.id,
    });

    if (!session) throw new HttpException(404, 'No session found');

    const state = await this.stateService.findOne({
      sessionId: session._id.toString(),
      type: StateType.video,
    });
    if (!state) throw new HttpException(404, 'No state found');

    await this.sessionService.update(session._id.toString(), {
      clippingStatus: ClippingStatus.failed,
    } as any);

    await this.stateService.update(state._id.toString(), {
      status: StateStatus.failed,
    });
  }
}
