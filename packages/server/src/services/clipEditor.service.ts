import { HttpException } from '@exceptions/HttpException';

import ClipEditor from '@models/clip.editor.model';
import Session from '@models/session.model';
import State from '@models/state.model';
import { ProcessingStatus, SessionType } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import { IClip } from '@interfaces/clip.interface';
import { Livepeer } from 'livepeer';
import SessionService from './session.service';
import { config } from '@config';
import SessionModel from '@models/session.model';
import StateService from './state.service';
import { getAsset } from '@utils/livepeer';
import { ClipEditorStatus } from '@interfaces/clip.editor.interface';
import { clipsQueue } from '@utils/redis';
import { Queue } from 'bull';

export class ClipEditorService extends SessionService {
  constructor(
    private readonly livepeer: Livepeer,
    private readonly stateService: StateService,
  ) {
    super();
  }

  async createClipSession(clipEditorId: string): Promise<string> {
    const clipEditor = await ClipEditor.findById(clipEditorId);
    if (!clipEditor) return;
    const event = clipEditor.events?.find((e) => e.label === 'main');
    if (!event?.sessionId) return;
    const session = await this.findOne({
      _id: event.sessionId,
    });
    if (!session) return;
    const createSession = await this.create({
      name: session.name,
      description: session.description,
      assetId: '',
      start: session.start,
      end: session.end,
      organizationId: session.organizationId,
      stageId: session.stageId,
      type: SessionType.clip,
      processingStatus: ProcessingStatus.pending,
      pretalxSessionCode: session.pretalxSessionCode,
      speakers: session.speakers,
    });
    await clipEditor.updateOne({
      clipSessionId: createSession._id,
    });
    await this.stateService.create({
      organizationId: createSession.organizationId,
      sessionId: createSession._id.toString(),
      type: StateType.clip,
      status: StateStatus.pending,
    });
    return createSession._id.toString();
  }

  async createClipState(sessionId: string): Promise<void> {
    const session = await this.findOne({ _id: sessionId });
    if (!session) return;
    const state = await State.findOne({
      sessionId: session._id.toString(),
      type: session.type,
    });
    if (state) {
      await this.stateService.update(state._id.toString(), {
        status: StateStatus.pending,
      });
    } else {
      await this.stateService.create({
        sessionId: session._id.toString(),
        sessionSlug: session.slug,
        organizationId: session.organizationId.toString(),
        type: session.type as any,
        status: StateStatus.pending,
      });
    }
  }

  async createClip(data: IClip) {
    try {
      if (data.isEditorEnabled) {
        return this.createEditorClip(data);
      } else {
        return this.createNormalClip(data);
      }
    } catch (e) {
      throw new HttpException(400, 'Error creating clip');
    }
  }

  async createEditorClip(data: IClip) {
    const events = data.editorOptions.events.filter((e) => e.sessionId !== '');
    data.editorOptions.events = events;
    const create = await ClipEditor.create({
      ...data.editorOptions,
      events,
      stageId: data.stageId,
      organizationId: data.organizationId,
    });
    const mainEvent = data.editorOptions?.events.find(
      (e) => e.label === 'main',
    );
    if (!mainEvent?.sessionId) return;
    const [clipSessionId] = await Promise.all([
      this.createClipSession(create._id.toString()),
      this.createClipState(mainEvent.sessionId),
    ]);
    const clipPayload = {
      ...data,
      clipEditorId: create._id.toString(),
      clipSessionId,
    };
    // redis queue
    const queue = await clipsQueue();
    await queue.add('clipEditorStatus', clipPayload);

    return {
      task: { id: '' },
      asset: {
        id: '',
        playbackId: '',
        userId: '',
        createdAt: '',
        createdByTokenName: '',
        status: [],
        name: '',
        source: [],
        projectId: '',
      },
    };
  }

  async createNormalClip(data: IClip) {
    const clip = await this.livepeer.stream.createClip({
      endTime: data.end,
      startTime: data.start,
      sessionId: data.recordingId,
      playbackId: data.playbackId,
    });
    const parsedClip = JSON.parse(clip.rawResponse.data.toString());
    const session = await Session.findById(data.sessionId);
    await Session.findOneAndUpdate(
      { _id: data.sessionId },
      {
        $set: {
          assetId: parsedClip.asset.id,
          playbackId: parsedClip.asset.playbackId,
          start: new Date().getTime(),
          end: new Date().getTime(),
          startClipTime: data.start,
          endClipTime: data.end,
          type:
            session.type === SessionType.editorClip
              ? SessionType.editorClip
              : SessionType.clip,
          createdAt: new Date(),
          processingStatus: ProcessingStatus.pending,
        },
      },
      {
        new: true,
        timestamps: false,
      },
    );
    await this.createClipState(data.sessionId);
    return parsedClip;
  }

  async getClipEditorStatus(
    data: IClip,
  ): Promise<{ status: boolean; events: Array<any> }> {
    const DEFAULT_EVENT = { id: '', label: '', type: '', url: '' };
    const eventPromises = data.editorOptions.events.map(
      async (event: { sessionId: string; label: string }) => {
        const session = await SessionModel.findById(event.sessionId);
        if (!session) return { status: true, ...DEFAULT_EVENT };
        if (session.processingStatus === ProcessingStatus.completed) {
          const asset = await getAsset(session.assetId);
          return {
            status: true,
            id: event.label,
            label: event.label,
            type: 'media',
            url: asset.downloadUrl,
          };
        }
        if (
          session.processingStatus === ProcessingStatus.failed &&
          event.label === 'main'
        ) {
          // const jobs = await pulse.jobs({
          //   'data.data.clipEditorId': data.clipEditorId,
          // });
          const clipEditor = await ClipEditor.findById(data.clipEditorId);
          await Promise.all([
            SessionModel.findByIdAndUpdate(clipEditor.clipSessionId, {
              processingStatus: ProcessingStatus.failed,
            }),
            clipEditor.updateOne({
              status: ClipEditorStatus.failed,
              message: 'main session polling failed',
            }),
          ]);
          // await Promise.all(jobs.map((job) => job.remove()));
        }
        return { status: false, ...DEFAULT_EVENT };
      },
    );
    const events = await Promise.all(eventPromises);
    return {
      status: events.every((result) => result.status),
      events,
    };
  }

  async refetchAssets(): Promise<void> {
    try {
      const sessions = await SessionModel.find({
        $and: [{ playbackId: { $eq: '' } }, { assetId: { $ne: '' } }],
      });
      if (sessions.length === 0) return;
      const sessionPromise = sessions.map(async (session) => {
        try {
          const asset = await getAsset(session.assetId);
          if (!asset) {
            return;
          }
          await session.updateOne({ playbackId: asset.playbackId });
        } catch (e) {
          throw new HttpException(400, 'Error refetching asset');
        }
      });
      await Promise.all(sessionPromise);
    } catch (e) {
      throw new HttpException(400, 'Error processing asset');
    }
  }
}

const clipEditorService = new ClipEditorService(
  new Livepeer({
    apiKey: config.livepeer.secretKey,
  }),
  new StateService(),
);
export default clipEditorService;
