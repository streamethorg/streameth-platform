import { HttpException } from '@exceptions/HttpException';

import ClipEditor from '@models/clip.editor.model';
import Session from '@models/session.model';
import { ProcessingStatus } from '@interfaces/session.interface';
import { IClip } from '@interfaces/clip.interface';
import { Livepeer } from 'livepeer';
import SessionService from './session.service';
import { config } from '@config';
import StateService from './state.service';
import {
  ClipEditorStatus,
  IClipEditor,
} from '@interfaces/clip.editor.interface';
import { clipsQueue } from '@utils/redis';

interface RemotionProgressResponse {
  type: 'success';
  data:
    | {
        type: 'progress';
        progress: number;
      }
    | {
        type: 'done';
        url: string;
        size: number;
      };
}

export class ClipEditorService extends SessionService {
  constructor(
    private readonly livepeer: Livepeer,
    private readonly stateService: StateService,
  ) {
    super();
  }

  async findByClipSessionId(id: string) {
    return ClipEditor.findOne({ clipSessionId: id });
  }

  async createClip(data: IClip) {
    try {
      if (data.isEditorEnabled) {
        return this.createEditorClip(data);
      } else {
        return this.createNormalClip({ ...data, editorOptions: null });
      }
    } catch (e) {
      throw new HttpException(400, 'Error creating clip');
    }
  }

  async createEditorClip(data: IClip) {
    // Get the main event session - needed regardless of captions
    const mainEvent = data.editorOptions?.events.find(
      (e) => e.label === 'main',
    );

    data.editorOptions.events.map((e) => {
      console.log('e', e);
    });
    const events = data.editorOptions.events;
    data.editorOptions.events = events;
    await ClipEditor.create({
      ...data.editorOptions,
      events,
      stageId: data.stageId,
      organizationId: data.organizationId,
      clipSessionId: data.sessionId,
    });
    if (!mainEvent?.sessionId) return;
    return await this.createNormalClip(data);
  }

  async createNormalClip(data: IClip) {
    const clipQueue = await clipsQueue();
    await clipQueue.add({
      ...data,
    });

    return;
  }

  async launchRemotionRender(clipEditor: IClipEditor) {
    // get all event session data based on event session ids
    const sessionIds = clipEditor.events
      .filter((e) => e.sessionId)
      .map((e) => e.sessionId);

    // Get all sessions in one query
    const eventSessions = await Session.find({
      _id: { $in: sessionIds },
    }).lean();

    // Create a map for quick session lookup
    const sessionsMap = eventSessions.reduce((acc, session) => {
      acc[session._id.toString()] = session;
      return acc;
    }, {});

    // check if all event sessions are completed
    const allEventSessionsCompleted = eventSessions.every(
      (e) =>
        e.processingStatus === ProcessingStatus.completed ||
        e.processingStatus === ProcessingStatus.clipCreated,
    );
    if (!allEventSessionsCompleted) return;

    const payload = {
      id: config.remotion.id,
      inputProps: {
        events: clipEditor.events.map((e) => {
          // If event has a direct videoUrl, use that
          if (e.videoUrl) {
            return {
              id: e.label,
              label: e.label,
              type: 'media',
              url: e.videoUrl,
            };
          }

          // Otherwise, look up the session from our map
          const session = e.sessionId
            ? sessionsMap[e.sessionId.toString()]
            : null;

          if (!session?.source?.streamUrl) {
            console.log(
              `Warning: No streamUrl found for session ${e.sessionId}`,
            );
          }

          // If this is the main event and captions are enabled, include transcripts
          const eventData: any = {
            id: e.label,
            label: e.label,
            type: 'media',
            url: session?.source?.streamUrl || '', // Always provide empty string as fallback
          };

          if (
            e.label === 'main' &&
            clipEditor.captionEnabled &&
            session?.transcripts?.chunks
          ) {
            eventData.transcript = {
              language: 'en',
              text: session.transcripts.text || '',
              words: session.transcripts.chunks.map((chunk) => ({
                word: chunk.word,
                start: chunk.start,
                end: chunk.end || chunk.start + 1, // Fallback end time if not provided
              })),
            };
          }

          return eventData;
        }),
        captionLinesPerPage: clipEditor.captionLinesPerPage.toString(),
        captionEnabled: clipEditor.captionEnabled,
        captionPosition: clipEditor.captionPosition,
        captionFont: clipEditor.captionFont,
        captionColor: clipEditor.captionColor,
        selectedAspectRatio: clipEditor.selectedAspectRatio,
        frameRate: 30,
      },
    };

    console.log('payload', payload);
    console.log('events', payload.inputProps.events);
    const response = await fetch(`${config.remotion.host}/api/lambda/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('response error:', errorData);
      throw new HttpException(400, 'Error launching remotion render');
    }

    const data = await response.json();

    await ClipEditor.findByIdAndUpdate(
      clipEditor._id,
      {
        $set: {
          renderId: data.data.renderId,
          status: ClipEditorStatus.rendering,
        },
      },
      { runValidators: false, new: true, lean: true },
    );
    return data;
  }

  async getSessionRenderingProgress(sessionId: string) {
    const session = await this.findByClipSessionId(sessionId);

    const response = await fetch(
      `${config.remotion.host}/api/lambda/progress`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: session.renderId,
          bucketName: 'remotionlambda-useast2-w6uye0gtql',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = (await response.json()) as RemotionProgressResponse;
    if (data.data.type === 'progress') {
      return data.data;
    }

    if (data.data.type === 'done') {
      return {
        type: 'done' as const,
        progress: 1,
      };
    }

    return data.data;
  }
}

const clipEditorService = new ClipEditorService(
  new Livepeer({
    apiKey: config.livepeer.secretKey,
  }),
  new StateService(),
);

export default clipEditorService;
