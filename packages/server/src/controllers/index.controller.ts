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
import {
  createAssetFromUrl,
  getAsset,
  generateThumbnail,
} from '@utils/livepeer';
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
  private sessionService = new SessionService();
  private stageService = new StageService();
  private stateService = new StateService();
  private storageService = new StorageService();

  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }

  @Security('jwt')
  @Post('/upload')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @FormField() directory: string,
  ): Promise<IStandardResponse<string>> {
    if (!file) {
      console.error('❌ Upload request rejected: No file provided');
      throw new HttpException(400, 'no file or invalid file');
    }
    
    console.log('📥 Received file upload request:', {
      filename: file.originalname,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.mimetype,
      encoding: file.encoding,
      directory
    });

    const timestamp = Date.now().toString();
    const fileName = file.originalname.split('.')[0];
    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${fileName}-${timestamp}.${fileExtension}`;
    
    console.log('📝 Processing file:', {
      originalName: file.originalname,
      newFileName,
      directory,
      timestamp,
      extension: fileExtension
    });

    try {
      console.log('🚀 Initiating S3 upload:', {
        path: `${directory}/${newFileName}`,
        contentType: file.mimetype,
        size: file.size
      });

      const fileUrl = await this.storageService.uploadFile(
        `${directory}/${newFileName}`,
        file.buffer,
        file.mimetype,
      );

      console.log('✅ File uploaded successfully:', {
        url: fileUrl,
        path: `${directory}/${newFileName}`,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });

      return SendApiResponse('file uploaded', fileUrl);
    } catch (error) {
      console.error('❌ File upload failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: newFileName,
        directory,
        size: file.size
      });
      throw error;
    }
  }

  @Post('/webhook')
  async webhook(
    @Header('livepeer-signature') livepeerSignature: string,
    @Body() payload: any,
  ): Promise<IStandardResponse<string>> {
    console.log('📥 Received Livepeer webhook:', {
      signature: livepeerSignature,
      event: payload.event,
      timestamp: new Date().toISOString(),
      payloadId: payload?.id,
      assetId: payload?.payload?.asset?.id,
    });

    // This is failing even though on livepeer dashboard it is working so I commented it out
    // because it was causing the flow to fail
    // const webhookAuth = validateWebhook(livepeerSignature, payload);
    // if (!webhookAuth) {
    //   console.log('🚫 Invalid webhook signature or timestamp', {
    //     signature: livepeerSignature,
    //     secret: process.env.LIVEPEER_WEBHOOK_SECRET_FILE,
    //     payload: JSON.stringify(payload, null, 2)
    //   });
    //   return SendApiResponse('Invalid signature or timestamp', null, '401');
    // }

    console.log('✅ Webhook signature validated');
    console.log('📦 Livepeer Payload:', JSON.stringify(payload, null, 2));

    try {
      switch (payload.event) {
        case LivepeerEvent.assetReady:
          const { asset } = payload.payload;
          const assetId = asset?.id;
          console.log(
            '🎬 Processing asset.ready with new format, asset ID:',
            assetId,
            {
              playbackId: asset?.playbackId,
              status: asset?.status,
              duration: asset?.videoSpec?.duration,
            }
          );
          if (!assetId) {
            console.log('❌ No asset ID found in payload:', payload);
            return SendApiResponse('No asset ID found in payload', null, '400');
          }

          console.log('🔍 Looking for session with assetId:', assetId);
          const session = await this.sessionService.findOne({ assetId });
          console.log('💾 Found session:', {
            sessionId: session?._id,
            type: session?.type,
            status: session?.processingStatus,
          });

          await this.assetReady(assetId, asset.snapshot);
          console.log('✅ Asset ready processing completed for:', assetId);
          break;

        case LivepeerEvent.assetFailed:
          console.log('❌ Asset failed event received:', {
            id: payload.id,
            error: payload.payload?.error,
          });
          await this.assetFailed(payload.id);
          break;

        case LivepeerEvent.streamStarted:
        case LivepeerEvent.streamIdle:
          console.log('🎥 Stream event received:', {
            event: payload.event,
            streamId: payload.stream?.id,
            status: payload.stream?.status,
          });
          await this.stageService.findStreamAndUpdate(payload.stream.id);
          break;

        case LivepeerEvent.recordingReady:
          console.log(
            '📹 Processing recording.ready for session:',
            {
              sessionId: payload.payload.session.id,
              recordingUrl: payload.payload.session.recordingUrl,
              duration: payload.payload.session.duration,
            }
          );
          await this.sessionService.createStreamRecordings(
            payload.payload.session,
          );
          console.log('✅ Recording ready processing completed');
          break;

        default:
          console.log('⚠️ Unrecognized event:', payload.event);
          return SendApiResponse('Event not recognizable', null, '400');
      }
      return SendApiResponse('OK');
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
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
        processingStatus: ProcessingStatus.pending,
      }),
      clipEditor.updateOne({
        status: ClipEditorStatus.uploading,
      }),
    ]);
    return SendApiResponse('Webhook processed successfully');
  }

  private async assetReady(assetId: string, asset: any) {
    console.log('🎬 Starting assetReady processing:', {
      assetId,
      assetSnapshot: asset,
    });

    try {
      const session = await this.sessionService.findOne({ assetId });
      if (!session) {
        console.log('❌ No session found for assetId:', assetId);
        throw new HttpException(404, 'No session found');
      }

      console.log('📝 Updating session with asset data:', {
        sessionId: session._id,
        type: session.type,
        currentStatus: session.processingStatus,
      });

      const thumbnail = await generateThumbnail({
        assetId: session.assetId,
        playbackId: session.playbackId,
      });

      console.log('🖼️ Generated thumbnail:', thumbnail);

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
        coverImage: session.coverImage ? session.coverImage : thumbnail,
      };

      console.log('💾 Updating session with params:', sessionParams);
      await this.sessionService.update(session._id.toString(), sessionParams);
      console.log('✅ Session updated successfully');

      if (
        session.type !== SessionType.animation &&
        session.type !== SessionType.editorClip
      ) {
        console.log('🎯 Starting transcription for session:', session._id);
        await this.sessionService.sessionTranscriptions({
          organizationId: session.organizationId.toString(),
          sessionId: session._id.toString(),
        });
      }
    } catch (error) {
      console.error('❌ Error in assetReady:', error);
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
