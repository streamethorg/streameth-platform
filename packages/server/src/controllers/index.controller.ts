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

    try {
      switch (payload.event) {
        case LivepeerEvent.assetReady:
          let assetId;
          if (payload.payload.asset) {
            // New webhook format
            assetId = payload.payload.asset.id;
            console.log('Processing asset.ready with new format, asset ID:', assetId);
          } else {
            // Legacy webhook format
            assetId = payload.payload.id;
            console.log('Processing asset.ready with legacy format, asset ID:', assetId);
          }
          
          if (!assetId) {
            console.log('No asset ID found in payload:', payload);
            return SendApiResponse('No asset ID found in payload', null, '400');
          }
          await this.assetReady(assetId);
          break;

        case LivepeerEvent.recordingReady:
          if (!payload.payload?.session?.assetId) {
            console.log('No session asset ID found in recording.ready payload:', payload);
            return SendApiResponse('No session asset ID found', null, '400');
          }
          console.log('Processing recording.ready for session:', payload.payload.session.id);
          await this.sessionService.createStreamRecordings(payload.payload.session);
          // Also process the asset since it's ready
          await this.assetReady(payload.payload.session.assetId);
          break;

        case LivepeerEvent.assetFailed:
          console.log('Processing asset.failed for:', payload.payload.id);
          await this.assetFailed(payload.payload.id);
          break;

        case LivepeerEvent.streamStarted:
        case LivepeerEvent.streamIdle:
          console.log('Processing stream event:', payload.event);
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;

        default:
          console.log('Unrecognized event:', payload.event);
          return SendApiResponse('Event not recognizable', null, '400');
      }
      return SendApiResponse('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new HttpException(500, `Error processing webhook: ${error.message}`);
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
    console.log('Processing asset ready for ID:', id);
    try {
      const asset = await getAsset(id);
      if (!asset) {
        console.log('Asset not found:', id);
        throw new HttpException(404, 'Asset not found');
      }
      
      const session = await this.sessionService.findOne({ assetId: asset.id });
      if (!session) {
        // Try finding by recording ID if session not found by asset ID
        const recordingSession = await this.sessionService.findOne({ 
          'recording.recordingId': asset.id 
        });
        if (!recordingSession) {
          console.log('No session found for asset:', asset.id);
          throw new HttpException(404, 'No session found');
        }
      }
      
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
      
      console.log('Updating session with params:', sessionParams);
      await this.sessionService.update(session._id.toString(), sessionParams);
      
      const state = await this.stateService.findOne({
        sessionId: session._id.toString(),
        type: session.type,
      });
      if (!state) {
        console.log('No state found for session:', session._id);
        throw new HttpException(404, 'No state found');
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
      
      console.log('Asset ready processing completed successfully');
    } catch (error) {
      console.error('Error in assetReady:', error);
      throw error;
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
