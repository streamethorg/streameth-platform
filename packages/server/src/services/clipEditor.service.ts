import { HttpException } from '@exceptions/HttpException';

import ClipEditor from '@models/clip.editor.model';
import Session from '@models/session.model';
import { ProcessingStatus } from '@interfaces/session.interface';
import { IClip } from '@interfaces/clip.interface';
import { Livepeer } from 'livepeer';
import SessionService from './session.service';
import { config } from '@config';
import StateService from './state.service';
import { IClipEditor } from '@interfaces/clip.editor.interface';
import { clipsQueue } from '@utils/redis';
import { RemotionPayload } from '@interfaces/remotion.webhook.interface';
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
    console.log('data', data);
    data.editorOptions.events.map((e) => {
      console.log('e', e);
    });
    const events = data.editorOptions.events.filter((e) => e.sessionId !== '');
    data.editorOptions.events = events;
    await ClipEditor.create({
      ...data.editorOptions,
      events,
      stageId: data.stageId,
      organizationId: data.organizationId,
      clipSessionId: data.sessionId,
    });
    const mainEvent = data.editorOptions?.events.find(
      (e) => e.label === 'main',
    );
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
    console.log('clipEditor', clipEditor);
    // get all event session data based on event session ids
    const eventSessions = await Session.find({
      _id: { $in: clipEditor.events.map((e) => e.sessionId) },
    });

    console.log('eventSessions', eventSessions);
    // check if all event sessions are completed
    const allEventSessionsCompleted = eventSessions.every(
      (e) =>
        e.processingStatus === ProcessingStatus.completed ||
        e.processingStatus === ProcessingStatus.clipCreated,
    );
    console.log('allEventSessionsCompleted', allEventSessionsCompleted);
    if (!allEventSessionsCompleted) return;

    const payload = {
      id: config.remotion.id,
      inputProps: {
        events: clipEditor.events.map((e) => {
          const session = eventSessions.find(
            (s) => s._id.toString() === e.sessionId.toString(), // Convert both to strings for comparison
          );

          if (!session?.source?.streamUrl) {
            console.log(
              `Warning: No streamUrl found for session ${e.sessionId}`,
            );
          }

          return {
            id: e.label,
            label: e.label,
            type: 'media',
            url: session?.source?.streamUrl, // Provide empty string as fallback
          };
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

    console.log('payload', JSON.stringify(payload, null, 2)); // Better logging of the full payload

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
    console.log('data', data);

    ClipEditor.updateOne(
      { _id: clipEditor._id },
      { $set: { remotionId: data.data.renderId } },
    );
    return data;
  }
}

const clipEditorService = new ClipEditorService(
  new Livepeer({
    apiKey: config.livepeer.secretKey,
  }),
  new StateService(),
);

export default clipEditorService;
