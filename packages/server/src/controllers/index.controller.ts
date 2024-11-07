import { HttpException } from '@exceptions/HttpException';
import { ClipEditorStatus } from '@interfaces/clip.editor.interface';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import { RemotionPayload } from '@interfaces/remotion.webhook.interface';
import { ProcessingStatus, SessionType } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import ClipEditor from '@models/clip.editor.model';
import SessionService from '@services/session.service';
import StageService from '@services/stage.service';
import StateService from '@services/state.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { updateEventVideoById } from '@utils/firebase';
import { createAssetFromUrl, getAsset, getDownloadUrl } from '@utils/livepeer';
import StorageService from '@utils/s3';
import {
  validateRemotionWebhook,
  validateWebhook,
} from '@utils/validateWebhook';
import express from 'express';
import {
  Body,
  Controller,
  FormField,
  Get,
  Header,
  Post,
  Request,
  Response,
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
    const webhookAuth = validateWebhook(livepeerSignature, payload);
    if (!webhookAuth) {
      console.log('Invalid signature or timestamp');
      return SendApiResponse('Invalid signature or timestamp', null, '401');
    }
    console.log('Livepeer Payload:', payload);
    switch (payload.event) {
      case LivepeerEvent.assetReady:
        await this.assetReady(payload.payload.id ?? payload.payload.asset.id);
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
  }

  @Post('/webhook/remotion')
  async webhookRemotion(
    @Request() req: express.Request,
    @Body() payload: RemotionPayload,
  ) {
    const remotionSignature = req.header('X-Remotion-Signature');
    const remotionStatus = req.header('X-Remotion-Status');

    if (!remotionSignature || !remotionStatus) {
      throw new HttpException(400, 'Missing required headers');
    }

    if (remotionStatus !== 'success') {
      return SendApiResponse('Acknowledged', '204');
    }

    const isValidSignature = validateRemotionWebhook(
      remotionSignature.split('=')[1],
      payload,
    );
    if (!isValidSignature) {
      throw new HttpException(401, 'Invalid signature');
    }

    const clipEditor = await ClipEditor.findOne({
      renderId: payload.renderId,
    });
    if (!clipEditor) {
      throw new HttpException(404, 'Clip editor not found');
    }
    const session = await this.sessionService.findOne({
      _id: clipEditor.clipSessionId,
    });
    if (!session) {
      throw new HttpException(404, 'Session not found');
    }
    const assetId = await createAssetFromUrl(session.name, payload.outputUrl);
    await Promise.all([
      this.sessionService.update(session._id.toString(), {
        assetId,
        name: session.name,
        start: session.start,
        end: session.end,
        organizationId: session.organizationId,
        type: session.type,
      }),
      clipEditor.updateOne({
        status: ClipEditorStatus.uploading,
      }),
    ]);
    return SendApiResponse('Webhook processed successfully');
  }

  private async assetReady(id: string) {
    const asset = await getAsset(id);
    const session = await this.sessionService.findOne({ assetId: asset.id });
    if (!session) throw new HttpException(404, 'No session found');
    let sessionParams = {
      name: session.name,
      start: session.start,
      end: session.end,
      organizationId: session.organizationId,
      type: session.type,
      videoUrl: asset.playbackUrl,
      playbackId: asset.playbackId,
      'playback.videoUrl': asset.playbackUrl,
      'playback.format': asset.videoSpec?.format ?? '',
      'playback.duration': asset.videoSpec?.duration ?? 0,
      processingStatus: ProcessingStatus.completed,
    };
    await this.sessionService.update(session._id.toString(), sessionParams);
    if (session.firebaseId && asset.playbackUrl) {
      await updateEventVideoById(session.firebaseId, {
        url: asset.playbackUrl,
        mp4Url: await getDownloadUrl(asset.id),
      });
    }
    const state = await this.stateService.findOne({
      sessionId: session._id.toString(),
      type: session.type,
    });
    if (!state) throw new HttpException(404, 'No state found');
    await this.stateService.update(state._id.toString(), {
      status: StateStatus.completed,
    });
    if (
      state.type !== StateType.animation &&
      state.type !== StateType.editorClip
    ) {
      await this.sessionService.sessionTranscriptions({
        organizationId: session.organizationId.toString(),
        sessionId: session._id.toString(),
      });
    }
    const clipEditor = await ClipEditor.findOne({ clipSessionId: session._id });
    if (clipEditor) {
      await clipEditor.updateOne({
        status: ClipEditorStatus.completed,
      });
    }
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
      ProcessingStatus: ProcessingStatus.failed,
    } as any);

    await this.stateService.update(state._id.toString(), {
      status: StateStatus.failed,
    });
  }
}
