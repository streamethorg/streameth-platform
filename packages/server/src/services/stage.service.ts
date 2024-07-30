import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ILiveStream, IStage } from '@interfaces/stage.interface';
import Stage from '@models/stage.model';
import Events from '@models/event.model';
import { Types } from 'mongoose';
import { createStream, deleteStream, getStreamInfo } from '@utils/livepeer';
import { config } from '@config';
import Organization from '@models/organization.model';
import { refreshAccessToken } from '@utils/oauth';
import { createYoutubeLiveStream } from '@utils/youtube';

export default class StageService {
  private path: string;
  private controller: BaseController<IStage>;
  constructor() {
    this.path = 'stages';
    this.controller = new BaseController<IStage>('db', Stage);
  }

  async create(data: IStage): Promise<IStage> {
    const eventId =
      !data.eventId || data.eventId.toString().length === 0
        ? new Types.ObjectId().toString()
        : data.eventId;
    const stream = await createStream(data.name);
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
  ): Promise<Array<IStage>> {
    return await this.controller.store.findAll({
      organizationId: organizationId,
    });
  }

  async deleteOne(stageId: string): Promise<void> {
    const stream = await this.get(stageId);
    await deleteStream(stream.streamSettings.streamId);
    return await this.controller.store.delete(stageId);
  }

  async findStreamAndUpdate(id: string): Promise<void> {
    const stream = await getStreamInfo(id);
    let stage = await Stage.findOne({ 'streamSettings.streamId': id });
    if (!stage) throw new HttpException(400, 'stage not found');
    await stage.updateOne(
      {
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
    const refeshToken = await refreshAccessToken(token.refreshToken);
    return await createYoutubeLiveStream({
      accessToken: refeshToken,
      title: stage.name,
      streamDate: stage.streamDate.toString(),
    });
  }
}
