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
import {
  createAsset,
  getAsset,
  getDownloadUrl,
  getStreamRecordings,
} from '@utils/livepeer';
import { refreshAccessToken } from '@utils/oauth';
import {
  sessionTranscriptionsQueue,
  videoImporterQueue,
  videoUploadQueue,
} from '@utils/redis';
import { Types } from 'mongoose';
import MarkerService from './marker.service';
import youtubedl from 'youtube-dl-exec';
import { getSourceType } from '@utils/util';

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

    // Check if we need to verify video count limits
    // Only apply this check for actual video uploads, not other types of sessions
    if (data.type === SessionType.video && data.organizationId) {
      // Get the organization to check video library limits
      const organization = await Organization.findById(data.organizationId);
      if (!organization) {
        throw new HttpException(404, 'Organization not found');
      }

      // Check if the organization has reached its video library limit
      if (
        organization.subscriptionStatus === 'active' &&
        organization.maxVideoLibrarySize !== undefined &&
        organization.currentVideoCount !== undefined &&
        organization.currentVideoCount >= organization.maxVideoLibrarySize
      ) {
        throw new HttpException(
          403,
          'Video library limit reached for this subscription tier. Please upgrade your subscription.',
        );
      }

      // Increment the video count for the organization
      await Organization.findByIdAndUpdate(data.organizationId, {
        $inc: { currentVideoCount: 1 },
      });
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

  async getAll(params: {
    event?: string;
    organizationId?: string;
    speaker?: string;
    stageId?: string;
    assetId?: string;
    onlyVideos?: boolean;
    size?: number;
    page?: number;
    published?: string;
    type?: string;
    itemStatus?: string;
    itemDate?: string; // unix timestamp
    clipable?: boolean;
    searchQuery?: string;
  }): Promise<{
    sessions: Array<ISession>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  }> {
    console.log('getAll', params, params.searchQuery);
    const filter = await this.buildSessionFilter(params);
    const { pageSize, pageNumber, skip } = this.calculatePagination(
      params.size,
      params.page,
    );

    const [sessions, totalItems] = await Promise.all([
      this.controller.store.findAll(filter, {}, this.path, skip, pageSize),
      this.controller.store.countDocuments(filter),
    ]);

    return {
      sessions,
      pagination: {
        totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / pageSize),
        limit: pageSize,
      },
    };
  }

  private async buildSessionFilter(params: {
    event?: string;
    organizationId?: string;
    speaker?: string;
    stageId?: string;
    assetId?: string;
    onlyVideos?: boolean;
    published?: string;
    type?: string;
    itemStatus?: string;
    itemDate?: string;
    clipable?: boolean;
    searchQuery?: string;
  }): Promise<{}> {
    let filter: any = {};

    console.log('params', params);
    // Handle session type filtering
    filter = this.applyTypeFilter(filter, params.type, params.stageId);

    // Apply basic filters
    filter = this.applyBasicFilters(filter, params);

    // Apply date filtering
    if (params.itemDate) {
      filter = this.applyDateFilter(filter, params.itemDate);
    }

    // Apply clipable filter
    if (params.clipable) {
      filter = this.applyClipableFilter(filter);
    }

    // Apply video-only filter
    if (params.onlyVideos) {
      filter = this.applyVideoOnlyFilter(filter);
    }

    // Apply search query filter
    if (params.searchQuery) {
      filter = this.applySearchFilter(filter, params.searchQuery);
    }

    // Apply entity-based filters (async operations)
    filter = await this.applyEntityFilters(filter, params);

    return filter;
  }

  private applyTypeFilter(filter: any, type?: string, stageId?: string): any {
    if (type !== undefined) {
      return { ...filter, type };
    }

    if (stageId === undefined) {
      return {
        ...filter,
        type: { $nin: [SessionType.animation, SessionType.editorClip] },
      };
    }

    return filter;
  }

  private applyBasicFilters(filter: any, params: any): any {
    const basicFilters = ['published', 'assetId', 'stageId'];

    basicFilters.forEach((key) => {
      if (params[key] !== undefined) {
        if (key === 'published') {
          filter.published = params[key];
        } else if (key === 'itemStatus') {
          filter.processingStatus = params[key];
        } else {
          filter[key] = params[key];
        }
      }
    });

    return filter;
  }

  private applyDateFilter(filter: any, itemDate: string): any {
    const itemDateNumber = Number(itemDate);
    const startOfDay = new Date(itemDateNumber);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(itemDateNumber);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      ...filter,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };
  }

  private applyClipableFilter(filter: any): any {
    return {
      ...filter,
      processingStatus: ProcessingStatus.completed,
      type: { $in: [SessionType.livestream, SessionType.video] },
    };
  }

  private applyVideoOnlyFilter(filter: any): any {
    return {
      ...filter,
      $or: [
        { playbackId: { $ne: '' } },
        { assetId: { $ne: '' } },
        { type: SessionType.animation },
      ],
    };
  }

  private applySearchFilter(filter: any, searchQuery: string): any {
    const searchRegex = new RegExp(searchQuery, 'i');

    return {
      ...filter,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { aiDescription: searchRegex },
        { autoLabels: { $in: [searchRegex] } },
        { speakers: { $in: [searchRegex] } },
        { track: searchRegex },
      ],
    };
  }

  private async applyEntityFilters(filter: any, params: any): Promise<any> {
    // Handle event filtering
    if (params.event) {
      const query = this.queryByIdOrSlug(params.event);
      const event = await Event.findOne(query);
      if (event) {
        filter.eventId = event._id;
      }
    }

    // Handle organization filtering
    if (params.organizationId) {
      const organization = await Organization.findById(params.organizationId);
      if (organization) {
        filter.organizationId = params.organizationId;
      }
    }

    return filter;
  }

  private calculatePagination(
    size?: number,
    page?: number,
  ): {
    pageSize: number;
    pageNumber: number;
    skip: number;
  } {
    const pageSize = Number(size) || 10; // Default to 10 instead of 0
    const pageNumber = Number(page) || 1; // Default to 1 instead of 0
    const skip = pageSize * (pageNumber - 1);

    return { pageSize, pageNumber, skip };
  }

  async deleteOne(sessionId: string): Promise<void> {
    const session = await this.get(sessionId);

    // Decrement the video count for the organization if this is a video session
    if (session.type === SessionType.video && session.organizationId) {
      await Organization.findByIdAndUpdate(
        session.organizationId,
        { $inc: { currentVideoCount: -1 } },
        // Ensure count doesn't go below 0
        { new: true, runValidators: true },
      );
    }

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
        timestamp: new Date().toISOString(),
      });
      throw new HttpException(
        404,
        `Stage not found for stream ID: ${payload.parentId}`,
      );
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
          timestamp: new Date().toISOString(),
        });
        throw new HttpException(
          404,
          `Stage not found for stream ID: ${streamId}`,
        );
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

  async importVideoFromUrl(d: {
    name: string;
    url: string;
    organizationId: string;
  }): Promise<ISession> {
    console.log('importVideoFromUrl', d);
    try {
      // Check if we need to verify video count limits
      if (d.organizationId) {
        // Get the organization to check video library limits
        const organization = await Organization.findById(d.organizationId);
        if (!organization) {
          throw new HttpException(404, 'Organization not found');
        }

        // Check if the organization has reached its video library limit
        if (
          organization.subscriptionStatus === 'active' &&
          organization.maxVideoLibrarySize !== undefined &&
          organization.currentVideoCount !== undefined &&
          organization.currentVideoCount >= organization.maxVideoLibrarySize
        ) {
          throw new HttpException(
            403,
            'Video library limit reached for this subscription tier. Please upgrade your subscription.',
          );
        }
      }

      const source = getSourceType(d.url);
      if (source.type === 'youtube' || source.type === 'twitter') {
        // First get video info
        console.log('importing video from url', source);
        let output = (await youtubedl(d.url, {
          dumpSingleJson: true,
          noWarnings: true,
          preferFreeFormats: true,
          addHeader: source.header,
          skipDownload: true,
        })) as unknown as {
          title: string;
          description: string;
          thumbnail: string;
          url: string;
        };

        console.log('output', output);

        // Create asset from downloaded file
        const asset = await createAsset(output.title);

        // Create and return the session
        const session = await this.controller.store.create(d.name, {
          name: output.title,
          description: output.description,
          coverImage: output.thumbnail,
          start: 0,
          end: 0,
          playbackId: '',
          stageId: new Types.ObjectId().toString(),
          organizationId: d.organizationId,
          type: SessionType.video,
          processingStatus: ProcessingStatus.pending,
          assetId: asset.assetId,
        });

        // call video importer queue
        const queue = await videoImporterQueue();
        await queue.add('import-video', {
          url: d.url,
          organizationId: d.organizationId,
          sessionName: d.name || output.title,
          source: source,
        });

        // Once we queue the job, increment the organization's video count
        await Organization.findByIdAndUpdate(d.organizationId, {
          $inc: { currentVideoCount: 1 },
        });

        return session;
      } else {
        throw new HttpException(400, 'Unsupported source type');
      }
    } catch (e) {
      console.error('Error importing video from URL:', e);
      throw new HttpException(500, `Error importing video: ${e.message}`);
    }
  }

  async extractHighlights(session: ISession, prompt?: string): Promise<void> {
    const chat = new ChatAPI();
    try {
      const { query, llmPrompt } = await chat.choosePrompt(
        session.transcripts.summary,
        prompt,
      );

      const chunks = session.transcripts.chunks;
      const similarPhrases = await chat.getSimilarPhrases(
        session._id.toString(),
        chunks,
        query,
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
        },
      );
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
