import { config } from '@config';
import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ILiveStream, IStage, StageType } from '@interfaces/stage.interface';
import Events from '@models/event.model';
import Organization from '@models/organization.model';
import Stage from '@models/stage.model';
import {
  createMultiStream,
  createStream,
  deleteStream,
  getStreamInfo,
  createAssetFromUrl,
} from '@utils/livepeer';
import { refreshAccessToken } from '@utils/oauth';
import { getSourceType } from '@utils/util';
import { createYoutubeLiveStream } from '@utils/youtube';
import { Types } from 'mongoose';
import youtubedl from 'youtube-dl-exec';
import { stageTranscriptionsQueue } from '@utils/redis';

export default class StageService {
  private path: string;
  private controller: BaseController<IStage>;
  constructor() {
    this.path = 'stages';
    this.controller = new BaseController<IStage>('db', Stage);
  }

  async create(data: IStage): Promise<IStage> {
    // Check if organization exists
    const organization = await Organization.findById(data.organizationId);
    if (!organization) throw new HttpException(404, 'Organization not found');

    // Check if the organization has livestreaming enabled
    if (!organization.isLivestreamingEnabled) {
      throw new HttpException(403, 'Livestreaming is not enabled for this organization. Please upgrade your subscription to create stages.');
    }

    const eventId =
      !data.eventId || data.eventId.toString().length === 0
        ? new Types.ObjectId().toString()
        : data.eventId;
    const stream = await createStream(data.name);
    console.log('stream', stream);

    // Note: We no longer track or limit the number of stages

    return this.controller.store.create(
      data.name,
      {
        ...data,
        eventId: eventId,
        streamSettings: {
          streamId: stream.streamId,
          streamKey: stream.streamKey,
          parentId: stream.parentId,
          playbackId: stream.playbackId,
        },
      },
      `${this.path}/${eventId}`,
    );
  }

  async get(stageId: string): Promise<IStage> {
    const findStage = await this.controller.store.findById(stageId);
    if (!findStage) throw new HttpException(404, 'Stage not found');
    return findStage;
  }

  async getAll(d: { published: boolean }): Promise<Array<IStage>> {
    let filter = {};
    if (d.published != undefined) {
      filter = { ...filter, published: d.published };
    }
    return await this.controller.store.findAll(filter);
  }

  async update(stageId: string, stage: IStage): Promise<IStage> {
    return await this.controller.store.update(stageId, stage, stage.name);
  }

  async findStageForEvent(stageId: string, eventId: string): Promise<IStage> {
    return await this.controller.store.findOne({
      slug: stageId,
      eventId: eventId,
    });
  }

  async findAllStagesForEvent(eventId: string): Promise<Array<IStage>> {
    const isObjectId = /[0-9a-f]{24}/i.test(eventId);
    const filter = isObjectId ? { _id: eventId } : { slug: eventId };
    const event = await Events.findOne(filter);
    return await this.controller.store.findAll({ eventId: event?._id });
  }

  async findAllStagesForOrganization(
    organizationId: string,
    fromDate?: string, // unix timestamp
    untilDate?: string, // unix timestamp
  ): Promise<Array<IStage>> {
    try {
      const organization = await Organization.findById(organizationId);
      if (!organization) throw new HttpException(404, 'Organization not found');
    } catch (error) {
      return [];
    }

    try {
      // Validate organizationId
      if (!organizationId) {
        throw new HttpException(400, 'Organization ID is required');
      }

      // Validate date formats if provided
      if (fromDate && isNaN(Number(fromDate))) {
        throw new HttpException(
          400,
          'Invalid fromDate format. Expected unix timestamp',
        );
      }
      if (untilDate && isNaN(Number(untilDate))) {
        throw new HttpException(
          400,
          'Invalid untilDate format. Expected unix timestamp',
        );
      }

      if (fromDate) {
        return await this.controller.store.findAll({
          organizationId: organizationId,
          createdAt: { $gte: new Date(Number(fromDate)) },
        });
      }

      if (untilDate) {
        return await this.controller.store.findAll({
          organizationId: organizationId,
          createdAt: { $lt: new Date(Number(untilDate)) },
        });
      }

      return await this.controller.store.findAll({
        organizationId: organizationId,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error fetching stages for organization');
    }
  }

  async deleteOne(stageId: string): Promise<void> {
    const stage = await this.get(stageId);
    await deleteStream(stage.streamSettings.streamId);

    // Get organization and only decrement if currentStages > 0
    const organization = await Organization.findById(stage.organizationId);
    if (organization && organization.currentStages > 0) {
      await Organization.findByIdAndUpdate(stage.organizationId, {
        $inc: { currentStages: -1 },
      });
    }

    return await this.controller.store.delete(stageId);
  }

  async findStreamAndUpdate(id: string): Promise<void> {
    const stream = await getStreamInfo(id);
    let stage = await Stage.findOne({ 'streamSettings.streamId': id });
    if (!stage) throw new HttpException(400, 'stage not found');

    if (!stream.isActive) {
      const queue = await stageTranscriptionsQueue();
      await queue.add({
        stageId: stage._id,
      });
    }

    await stage.updateOne(
      {
        'stageSettings.transcripts.status': !stream.isActive
          ? 'in-queue'
          : undefined,
        'streamSettings.isActive': stream.isActive,
        'streamSettings.isHealthy': stream.isHealthy ?? false,
      },
      { upsert: true },
    );
  }

  async createMetadata(stageId: string) {
    let stage = await Stage.findById(stageId);
    let metadata = {
      name: stage.name,
      description: stage.description,
      external_url: '',
      animation_url: `${config.playerUrl}/embed?playbackId=${stage.streamSettings.playbackId}&vod=false&streamId=${stage.streamSettings.streamId}&playerName=${stage.name}`,
      image: stage.thumbnail,
      attributes: [
        {
          name: stage.name,
          description: stage.description,
          organizationId: stage.organizationId,
          eventId: stage.eventId,
          slug: stage.slug,
          createdAt: stage.createdAt,
          streamId: stage.streamSettings.streamId,
          playbackId: stage.streamSettings.playbackId,
        },
      ],
    };
    return metadata;
  }

  async createLiveStream(data: ILiveStream) {
    const stage = await this.get(data.stageId);
    const org = await Organization.findOne({ _id: stage.organizationId });
    const token = org.socials.find(
      (e) => e.type == data.socialType && e._id == data.socialId,
    );
    const accessToken = await refreshAccessToken(token.refreshToken);
    const streamDate =
      new Date(stage.streamDate.toString()) < new Date()
        ? new Date().toISOString()
        : stage.streamDate.toString();
    const stream = await createYoutubeLiveStream({
      accessToken: accessToken,
      title: stage.name,
      streamDate,
      thumbnail: stage.thumbnail,
    });
    await createMultiStream({
      name: stage.name,
      streamId: stage.streamSettings.streamId,
      targetStreamKey: stream.streamKey,
      targetURL: stream.ingestUrl,
      organizationId: stage.organizationId.toString(),
      socialId: data.socialId,
      socialType: data.socialType,
      broadcastId: stream.broadcastId,
    });
    return stream;
  }
}
