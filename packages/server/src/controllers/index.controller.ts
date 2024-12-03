import { HttpException } from '@exceptions/HttpException';
import { ClipEditorStatus } from '@interfaces/clip.editor.interface';
import { LivepeerEvent } from '@interfaces/livepeer.interface';
import { RemotionPayload } from '@interfaces/remotion.webhook.interface';
import { ProcessingStatus, SessionType } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import ClipEditor from '@models/clip.editor.model';
import Session from '@models/session.model';
import SessionService from '@services/session.service';
import StageService from '@services/stage.service';
import StateService from '@services/state.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { createAssetFromUrl, getAsset, getDownloadUrl } from '@utils/livepeer';
import StorageService from '@utils/s3';
import {
  validateRemotionWebhook,
  validateWebhook,
} from '@utils/validateWebhook';
import express from 'express';
import { Types } from 'mongoose';
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
import rabbitmqConnection from '@utils/rabbitmq';
import { logger } from '@utils/logger';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  private sessionService = new SessionService();
  private stageService = new StageService();
  private stateService = new StateService();
  private storageService = new StorageService();

  private async acquireLock(
    lockKey: string,
    ttl: number = 60000,
  ): Promise<boolean> {
    try {
      const connection = await rabbitmqConnection;
      if (!connection) {
        logger.error('No RabbitMQ connection available');
        return false;
      }

      const channel = await connection.createChannel();
      const queue = `lock:${lockKey}`;

      // Try to declare an exclusive queue - if it succeeds, we got the lock
      try {
        await channel.assertQueue(queue, {
          exclusive: true,
          autoDelete: true,
          arguments: {
            'x-expires': ttl, // Queue will be deleted after TTL
          },
        });
        await channel.close();
        return true;
      } catch (err) {
        // Queue exists, meaning lock is taken
        await channel.close();
        return false;
      }
    } catch (err) {
      logger.error('Error acquiring lock:', err);
      return false;
    }
  }

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

    // Create a unique lock key based on the event and relevant ID
    const lockKey = `livepeer:${payload.event}:${
      payload.asset?.id ||
      payload.stream?.id ||
      payload.payload?.id ||
      payload.payload?.session?.id ||
      'unknown'
    }`;

    // Try to acquire the lock
    const lockAcquired = await this.acquireLock(lockKey);
    if (!lockAcquired) {
      logger.info(`Skipping duplicate webhook processing for ${lockKey}`);
      return SendApiResponse(
        'Webhook already being processed by another instance',
      );
    }

    console.log('Livepeer Payload:', payload);
    try {
      switch (payload.event) {
        case LivepeerEvent.assetReady:
          const assetId = payload.asset?.id;
          console.log(
            'Processing asset.ready with new format, asset ID:',
            assetId,
          );
          if (!assetId) {
            console.log('No asset ID found in payload:', payload);
            return SendApiResponse('No asset ID found in payload', null, '400');
          }
          await this.assetReady(assetId);
          break;
        case LivepeerEvent.assetFailed:
          await this.assetFailed(payload.payload.id);
          break;
        case LivepeerEvent.streamStarted:
        case LivepeerEvent.streamIdle:
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;
        case LivepeerEvent.recordingReady:
          console.log(
            'Processing recording.ready for session:',
            payload.payload.session.id,
          );
          await this.sessionService.createStreamRecordings(
            payload.payload.session,
          );
          break;
        default:
          return SendApiResponse('Event not recognizable', null, '400');
      }
      return SendApiResponse('OK');
    } catch (error) {
      logger.error(`Error processing webhook ${lockKey}:`, error);
      throw error;
    }
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
      const clipEditor = await ClipEditor.findOne({
        renderId: payload.renderId,
      });
      await Promise.all([
        Session.findOneAndUpdate(
          { _id: new Types.ObjectId(clipEditor.clipSessionId) },
          {
            processingStatus: ProcessingStatus.failed,
          },
        ),
        clipEditor.updateOne({
          status: ClipEditorStatus.failed,
        }),
      ]);
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

    // Map session type to state type
    let stateType: StateType;
    switch (session.type) {
      case SessionType.video:
        stateType = StateType.video;
        break;
      case SessionType.animation:
        stateType = StateType.animation;
        break;
      case SessionType.clip:
        stateType = StateType.clip;
        break;
      case SessionType.editorClip:
        stateType = StateType.editorClip;
        break;
      case SessionType.livestream:
      default:
        stateType = StateType.video;
        break;
    }

    // Find or create state record
    let state = await this.stateService
      .findOne({
        sessionId: session._id.toString(),
        type: stateType,
      })
      .catch(() => null);

    if (!state) {
      // Create new state if it doesn't exist
      state = await this.stateService.create({
        sessionId: session._id.toString(),
        organizationId: session.organizationId,
        type: stateType,
        status: StateStatus.pending,
      });
    }

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
      type: session.type,
    });
    if (!state) throw new HttpException(404, 'No state found');
    await this.sessionService.update(session._id.toString(), {
      processingStatus: ProcessingStatus.failed,
    } as any);
    await this.stateService.update(state._id.toString(), {
      status: StateStatus.failed,
    });
  }
}
