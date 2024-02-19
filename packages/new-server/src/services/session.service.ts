import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ISession } from '@interfaces/session.interface';
import Organization from '@models/organization.model';
import Session from '@models/session.model';
import Event from '@models/event.model';

export default class SessionServcie {
  private path: string;
  private controller: BaseController<ISession>;
  constructor() {
    this.path = 'sessions';
    this.controller = new BaseController<ISession>('db', Session);
  }

  async create(data: ISession): Promise<ISession> {
    return this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.eventId}`,
    );
  }

  async update(sessionId: string, session: ISession): Promise<ISession> {
    return await this.controller.store.update(sessionId, session, session.name);
  }

  async get(sessionId: string): Promise<ISession> {
    const findSession = await this.controller.store.findById(sessionId);
    if (!findSession) throw new HttpException(404, 'Event not found');
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
  }): Promise<{
    sessions: Array<ISession>;
    totalDocuments: number;
    pageable: { page: number; size: number };
  }> {
    let filter = {};
    if (d.event != undefined) {
      let event = await Event.findOne({ slug: d.event });
      filter = { ...filter, eventId: event?._id };
    }
    if (d.organization != undefined) {
      let org = await Organization.findOne({ slug: d.organization });
      filter = { ...filter, organizationId: org?._id };
    }
    if (d.onlyVideos) {
      filter = { ...filter, playbackId: { $ne: '' } };
    }
    if (d.assetId != undefined) {
      filter = { ...filter, assetId: d.assetId };
    }
    if (d.stageId != undefined) {
      filter = { ...filter, stageId: d.stageId };
    }
    const pageSize = Number(d.size) || 0; //total documents to be fetched
    const pageNumber = Number(d.page) || 0;
    const skip = pageSize * pageNumber - pageSize;
    const [sessions, totalDocuments] = await Promise.all([
      await this.controller.store.findAll(filter, this.path, skip, pageSize),
      await this.controller.store.findAll(filter, this.path, 0, 0),
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
}
