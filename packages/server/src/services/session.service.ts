import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ISession, SessionType } from '@interfaces/session.interface';
import Organization from '@models/organization.model';
import Session from '@models/session.model';
import Event from '@models/event.model';
import { config } from '@config';
import { Types } from 'mongoose';
import Stage from '@models/stage.model';
import { getDownloadUrl, getStreamRecordings } from '@utils/livepeer';
import Fuse from 'fuse.js';
import { IUploadSession } from '@interfaces/upload.session.interface';
import { refreshAccessToken } from '@utils/oauth';
import connection from '@utils/rabbitmq';

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
      let stage = await Stage.findById(data.stageId);
      stageId = stage._id;
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
      { ...data, eventSlug: eventSlug, eventId: eventId, stageId: stageId },
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
    organization: string;
    speaker: string;
    stageId: string;
    assetId: string;
    onlyVideos: boolean;
    size: number;
    page: number;
    published: boolean;
  }): Promise<{
    sessions: Array<ISession>;
    totalDocuments: number;
    pageable: { page: number; size: number };
  }> {
    let filter = {};
    if (d.published != undefined) {
      filter = { ...filter, published: d.published };
    }
    if (d.event != undefined) {
      let query = this.queryByIdOrSlug(d.event);
      let event = await Event.findOne(query);
      filter = { ...filter, eventId: event?._id };
    }
    if (d.organization != undefined) {
      let query = this.queryByIdOrSlug(d.organization);
      let org = await Organization.findOne(query);
      filter = { ...filter, organizationId: org?._id };
    }
    if (d.onlyVideos) {
      filter = {
        ...filter,
        $or: [{ playbackId: { $ne: '' } }, { assetId: { $ne: '' } }],
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
    const pageSize = Number(d.size) || 0; //total documents to be fetched
    const pageNumber = Number(d.page) || 0;
    const skip = pageSize * pageNumber - pageSize;
    const [sessions, totalDocuments] = await Promise.all([
      await this.controller.store.findAllAndSort(
        filter,
        this.path,
        skip,
        pageSize,
      ),
      await this.controller.store.findAll(filter, {}, this.path, 0, 0),
    ]);
    return {
      sessions: sessions,
      totalDocuments: totalDocuments.length,
      pageable: {
        page: pageNumber,
        size: pageSize,
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
        published: true,
        onlyVideos: true,
      } as any);
      sessions.push(session.sessions);
    }
    return sessions;
  }

  async filterSessions(
    query: string,
    organizationSlug?: string,
  ): Promise<Array<ISession>> {
    const options = {
      keys: ['name', 'description', 'speakers.name'],
    };
    const sessions = await this.getAll({
      organization: organizationSlug,
      page: 0,
      size: 0,
      onlyVideos: true,
    } as any);

    const fuse = new Fuse(sessions.sessions, options);
    const result: any = fuse.search(query);
    return result;
  }

  async createStreamRecordings(payload: any) {
    let stage = await Stage.findOne({
      'streamSettings.streamId': payload.parentId,
    });
    await this.create({
      name: payload.name,
      description: payload.name,
      start: payload.createdAt,
      end: payload.lastSeen,
      playbackId: payload.playbackId,
      videoUrl: payload.recordingUrl,
      organizationId: stage.organizationId,
      assetId: payload.assetId,
      type: SessionType.livestream,
    });
  }

  async uploadSessionToSocials(data: IUploadSession) {
    const session = await this.get(data.sessionId.toString());
    if (!session.assetId || !session.videoUrl) {
      throw new HttpException(400, 'Asset Id or video Url does not exist');
    }
    // if (!session.coverImage) {
    //   throw new HttpException(400, 'No cover image');
    // }
    const org = await Organization.findOne({
      _id: data.organizationId,
      'socials._id': data.socialId,
    });
    const token = org.socials.find(
      (e) => e.type == data.type && e._id == data.socialId,
    );
    if (data.type == 'youtube') {
      data.token = await refreshAccessToken(token.refreshToken);
    }
    const queue = 'videos';
    const channel = await (await connection).createChannel();
    channel.assertQueue(queue, {
      durable: true,
    });
    const payload = {
      ...data,
      session: {
        videoUrl: session.videoUrl,
        slug: session.slug,
        name: session.name,
        description: session.description,
        coverImage: session.coverImage,
        published: session.published,
      },
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  }

  private async createMultipleStreamRecordings(streamId: string) {
    const recordings = await getStreamRecordings(streamId);
    for (const recording of recordings) {
      let stage = await Stage.findOne({ 'streamSettings.streamId': streamId });
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
}
