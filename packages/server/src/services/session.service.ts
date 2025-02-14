import { config } from '@config';
import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { RecordingSessionPayload } from '@interfaces/livepeer.webhook.interface';
import {
  eVisibilty,
  ISession,
  ProcessingStatus,
  SessionType,
} from '@interfaces/session.interface';
import {
  StateStatus,
  StateType,
  TranscriptionStatus,
} from '@interfaces/state.interface';
import { IUploadSession } from '@interfaces/upload.session.interface';
import Event from '@models/event.model';
import Organization from '@models/organization.model';
import Session from '@models/session.model';
import Stage from '@models/stage.model';
import State from '@models/state.model';
import { ChatAPI } from '@utils/ai.chat';
import { getAsset, getDownloadUrl, getStreamRecordings } from '@utils/livepeer';
import { refreshAccessToken } from '@utils/oauth';
import { sessionTranscriptionsQueue, videoUploadQueue } from '@utils/redis';
import { Types } from 'mongoose';
import MarkerService from './marker.service';
import { IMarker } from '@interfaces/marker.interface';
import { chat } from 'googleapis/build/src/apis/chat';

export default class SessionService {
  private path: string;
  private controller: BaseController<ISession>;
  constructor() {
    this.path = 'sessions';
    this.controller = new BaseController<ISession>('db', Session);
  }

  async create(data: ISession): Promise<ISession> {
    let eventId = '';
    let eventSlug = '';
    let stageId = '';
    if (data.stageId == undefined || data.stageId.toString().length === 0) {
      stageId = new Types.ObjectId().toString();
    } else {
      stageId = data.stageId.toString();
    }
    if (data.eventId == undefined || data.eventId.toString().length === 0) {
      eventId = new Types.ObjectId().toString();
      if (data.speakers == undefined || data.speakers.length == 0)
        data.speakers = [];
      if (data.speakers.length > 0)
        data.speakers.map((speaker) => (speaker.eventId = eventId));
    } else {
      let event = await Event.findById(data.eventId);
      eventId = event._id;
      eventSlug = event.slug;
    }
    return this.controller.store.create(
      data.name,
      {
        ...data,
        eventSlug: eventSlug,
        eventId: eventId,
        stageId: stageId,
        type: data.type,
        processingStatus: data?.processingStatus ?? ProcessingStatus.pending,
      },
      `${this.path}/${eventId}`,
    );
  }

  async update(sessionId: string, session: ISession): Promise<ISession> {
    return await this.controller.store.update(sessionId, session, session.name);
  }

  async findOne(query: {}): Promise<ISession> {
    return await this.controller.store.findOne(query);
  }

  async get(sessionId: string): Promise<ISession> {
    const findSession = await this.controller.store.findById(sessionId);
    if (!findSession) throw new HttpException(404, 'Session not found');
    return findSession;
  }

  async getAll(d: {
    event: string;
    organizationId: string;
    speaker: string;
    stageId: string;
    assetId: string;
    onlyVideos: boolean;
    size: number;
    page: number;
    published: string;
    type: string;
    itemStatus: string;
    itemDate: string; // unix timestamp
    clipable: boolean;
  }): Promise<{
    sessions: Array<ISession>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  }> {
    let filter: {} = {};

    // Only exclude animations and editor clips if no specific type is requested and no stageId is provided
    if (d.type === undefined && d.stageId === undefined) {
      console.log(
        'No type or stageId specified, excluding animations and editor clips',
      );
      filter = {
        type: { $nin: [SessionType.animation, SessionType.editorClip] },
      };
    } else if (d.type !== undefined) {
      console.log('Type specified:', d.type);
      filter = { type: d.type };
    }

    if (d.published != undefined) {
      filter = { ...filter, published: d.published };
    }
    if (d.itemStatus != undefined) {
      filter = { ...filter, processingStatus: d.itemStatus };
    }
    if (d.itemDate != undefined) {
      const itemDateNumber = Number(d.itemDate);
      const startOfDay = new Date(itemDateNumber);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(itemDateNumber);
      endOfDay.setHours(23, 59, 59, 999);

      filter = { ...filter, createdAt: { $gte: startOfDay, $lte: endOfDay } };
    }
    if (d.clipable) {
      // its clippable if createdAt not older than 7 days and processingStatus is completed and type is livestream
      const clipableDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filter = {
        ...filter,
        createdAt: { $gte: clipableDate },
        processingStatus: ProcessingStatus.completed,
        type: SessionType.livestream,
      };
    }
    if (d.event != undefined) {
      let query = this.queryByIdOrSlug(d.event);
      let event = await Event.findOne(query);
      filter = { ...filter, eventId: event?._id };
    }
    if (d.organizationId != undefined) {
      filter = { ...filter, organizationId: d.organizationId };
    }
    if (d.onlyVideos) {
      filter = {
        ...filter,
        $or: [
          { playbackId: { $ne: '' } },
          { assetId: { $ne: '' } },
          { type: SessionType.animation },
        ],
      };
    }
    if (d.assetId != undefined) {
      filter = { ...filter, assetId: d.assetId };
    }
    if (d.stageId != undefined) {
      let query = this.queryByIdOrSlug(d.stageId);
      let stage = await Stage.findOne(query);
      filter = { ...filter, stageId: stage?._id };
    }

    const pageSize = Number(d.size) || 0;
    const pageNumber = Number(d.page) || 0;
    const skip = pageSize * pageNumber - pageSize;

    const sessions = await this.controller.store.findAll(
      filter,
      {},
      this.path,
      skip,
      pageSize,
    );

    const totalItems = await this.controller.store.countDocuments(filter);
    return {
      sessions: sessions,
      pagination: {
        totalItems: totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / pageSize),
        limit: pageSize,
      },
    };
  }

  async deleteOne(sessionId: string): Promise<void> {
    await this.get(sessionId);
    return await this.controller.store.delete(sessionId);
  }

  async createMetadata(sessionId: string) {
    let session = await Session.findById(sessionId);
    let animation = await getDownloadUrl(session.assetId);
    console.log('animation_url:', animation);
    let metadata = {
      name: session.name,
      description: session.description,
      external_url: `${config.baseUrl}/watch?event=${session.eventSlug}&session=${session._id}`,
      animation_url: await getDownloadUrl(session.assetId),
      image: session.coverImage,
      attributes: [
        {
          start: session.start,
          end: session.end,
          stageId: session.stageId,
          speakers: session.speakers,
          source: session.source,
          playbackId: session.playbackId,
          assetId: session.assetId,
          eventId: session.eventId,
          track: session.track,
          coverImage: session.coverImage,
          slug: session.slug,
          organizationId: session.organizationId,
          eventSlug: session.eventSlug,
          createdAt: session.createdAt,
          aiDescription: session.aiDescription,
          autoLabels: session.autoLabels,
          videoTranscription: session.videoTranscription,
        },
      ],
    };
    return metadata;
  }

  async getOrgEventSessions(organizationId: string): Promise<Array<ISession>> {
    let sessions = [];
    const events = await Event.find({ organizationId: organizationId });
    for (const event of events) {
      let session = await this.getAll({
        event: event._id,
        published: eVisibilty.public,
        onlyVideos: true,
      } as any);
      sessions.push(session.sessions);
    }
    return sessions;
  }

  async filterSessions(
    query: string,
    organizationId?: string,
  ): Promise<Array<ISession>> {
    console.time('filterSessionsExecutionTime');
    console.log(query);
    const sessions = await this.controller.store.findAll(
      {
        name: { $regex: query, $options: 'i' },
        organizationId: organizationId ? organizationId : '',
      },
      {},
      this.path,
      0,
      10,
    );
    console.timeEnd('filterSessionsExecutionTime');
    return sessions;
  }

  async createStreamRecordings(payload: RecordingSessionPayload) {
    let stage = await Stage.findOne({
      'streamSettings.streamId': payload.parentId,
    });

    if (!stage) {
      console.error('❌ Stage not found for stream ID:', {
        streamId: payload.parentId,
        timestamp: new Date().toISOString()
      });
      throw new HttpException(404, `Stage not found for stream ID: ${payload.parentId}`);
    }

    const asset = await getAsset(payload.assetId);
    const session = await this.create({
      name: `${stage.name}-Recording ${stage.recordingIndex}`.trim(),
      description: payload.name,
      start: payload.createdAt,
      end: payload.lastSeen,
      playbackId: payload.playbackId,
      videoUrl: payload.recordingUrl,
      organizationId: stage.organizationId,
      assetId: payload.assetId,
      stageId: stage._id.toString(),
      type: SessionType.livestream,
      playback: {
        videoUrl: payload.recordingUrl,
        format: asset.videoSpec?.format ?? '',
        duration: asset.videoSpec?.duration ?? 0,
      },
      processingStatus: ProcessingStatus.completed,
    });
    await stage.updateOne({ $inc: { recordingIndex: 1 } });
    await this.sessionTranscriptions({
      organizationId: session.organizationId,
      sessionId: session._id.toString(),
    });
  }

  async sessionTranscriptions(
    data: Pick<IUploadSession, 'organizationId' | 'sessionId'>,
  ) {
    const session = await this.get(data.sessionId.toString());
    const queue = await sessionTranscriptionsQueue();
    await queue.add({
      ...data,
      session: {
        id: session._id,
        videoUrl: session.videoUrl,
        slug: session.slug,
        name: session.name,
      },
    });
    await this.update(data.sessionId.toString(), {
      //@ts-ignore
      ...session.toObject(),
      transcripts: {
        ...(session.transcripts || {}),
        status: TranscriptionStatus.processing,
      },
    });
  }

  async uploadSessionToSocials(data: IUploadSession) {
    const session = await this.get(data.sessionId.toString());
    if (!session.assetId || !session.videoUrl) {
      throw new HttpException(400, 'Asset Id or video Url does not exist');
    }
    let token;
    if (data.socialId) {
      const org = await Organization.findOne({
        _id: data.organizationId,
        'socials._id': data.socialId,
      });
      token = org.socials.find(
        (e) => e.type == data.type && e._id == data.socialId,
      );
    }
    if (data.type == 'youtube') {
      data.token = {
        secret: await refreshAccessToken(token?.refreshToken),
      };
    }
    if (data.type == 'twitter') {
      if (session.playback.duration > 140) {
        throw new HttpException(
          400,
          'Twitter only supports videos less than 2 minutes',
        );
      }
      data.token = { key: token.accessToken, secret: token.refreshToken };
    }
    const queue = await videoUploadQueue();
    await queue.add({
      ...data,
      session: {
        videoUrl: session.videoUrl,
        slug: session.slug,
        name: session.name,
        description: session.description,
        coverImage: session.coverImage,
        published: session.published,
      },
    });
    const state = await State.findOne({
      sessionId: data.sessionId,
      type: StateType.social,
      socialType: data.type,
    });
    if (state) {
      await state.updateOne({ status: StateStatus.pending });
    } else {
      await State.create({
        organizationId: data.organizationId,
        sessionId: data.sessionId,
        status: StateStatus.pending,
        type: StateType.social,
        socialType: data.type,
      });
    }
  }

  private async createMultipleStreamRecordings(streamId: string) {
    const recordings = await getStreamRecordings(streamId);
    for (const recording of recordings) {
      let stage = await Stage.findOne({ 'streamSettings.streamId': streamId });
      
      if (!stage) {
        console.error('❌ Stage not found for stream ID:', {
          streamId,
          timestamp: new Date().toISOString()
        });
        throw new HttpException(404, `Stage not found for stream ID: ${streamId}`);
      }

      await this.create({
        name: recording.name,
        description: recording.name,
        start: recording.createdAt,
        end: recording.lastSeen,
        playbackId: recording.playbackId,
        videoUrl: recording.recordingUrl,
        organizationId: stage.organizationId,
        type: SessionType.livestream,
      });
    }
  }

  private queryByIdOrSlug(id: string) {
    const isObjectId = /[0-9a-f]{24}/i.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    return query;
  }

  async launchExtractHighlights(sessionId: string, prompt?: string) {
    const session = await this.get(sessionId);
    if (session.aiAnalysis.status === ProcessingStatus.pending) {
      throw new HttpException(400, 'Highlights already being extracted');
    }
    this.extractHighlights(session, prompt);
    await Session.updateOne(
      { _id: sessionId },
      {
        $set: {
          aiAnalysis: {
            status: ProcessingStatus.pending,
            isVectorized: false,
          },
        },
      },
    );
    return;
  }

  async extractHighlights(session: ISession, prompt?: string): Promise<void> {
    const chat = new ChatAPI();
    try {
      const { query, llmPrompt, optimalScore } = await chat.choosePrompt(prompt);

      const chunks = session.transcripts.chunks;
      const similarPhrases = await chat.getSimilarPhrases(
        session._id.toString(),
        chunks,
        query,
        optimalScore,
      );
      console.log('similarPhrases', similarPhrases);
      const contextualizedPhrases = chat.contextualizePhrasesWithTimestamps(
        similarPhrases,
        chunks,
      );

      console.log('contextualizedPhrases', contextualizedPhrases);

      const highlights = await chat.getAIHighlights(
        chat,
        llmPrompt,
        contextualizedPhrases,
        prompt,
      );

      console.log('highlights', highlights);
      const parsedHighlights = chat.parseAndValidateHighlights(highlights);

      const markerService = new MarkerService();
      await Promise.all(
        parsedHighlights.map((highlight) =>
          markerService.create({
            name: highlight.title,
            start: Number(highlight.start),
            end: Number(highlight.end),
            stageId: session.stageId,
            sessionId: session._id,
            organizationId: session.organizationId.toString(),
            date: session.createdAt.toString(),
            color: '#000000',
            startClipTime: Number(highlight.start),
            endClipTime: Number(highlight.end),
          }),
        ),
      );
      await Session.updateOne(
        { _id: session._id },
        {
          $set: {
          aiAnalysis: {
            status: ProcessingStatus.completed,
            isVectorized: true,
          },
        },
      });
    } catch (error) {
      console.error('Error extracting highlights:', error);
      await Session.updateOne(
        { _id: session._id },
        {
          $set: {
            aiAnalysis: {
              status: ProcessingStatus.failed,
              isVectorized: false,
            },
          },
        },
      );
    }
  }
}
