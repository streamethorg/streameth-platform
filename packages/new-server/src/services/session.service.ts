import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ISession } from '@interfaces/session.interface';
import Session from '@models/session.model';

export default class SessionServcie {
  private path: string;
  private controller: BaseController<ISession>;
  constructor() {
    this.path = 'sessions';
    this.controller = new BaseController<ISession>('db', Session);
  }

  async create(data: ISession): Promise<ISession> {
    const findSession = await this.controller.store.findOne(
      { name: data.name },
      `${this.path}/${data.eventId}`,
    );
    if (findSession) throw new HttpException(409, 'Session already exists');
    return this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.eventId}`,
    );
  }

  async update(sessionId: string, session: ISession): Promise<ISession> {
    return await this.controller.store.update(sessionId, session);
  }

  async get(sessionId: string): Promise<ISession> {
    const findSession = await this.controller.store.findById(sessionId);
    if (!findSession) throw new HttpException(404, 'Event not found');
    return findSession;
  }

  async getAll(): Promise<Array<ISession>> {
    return await this.controller.store.findAll({}, this.path);
  }

  async deleteOne(sessionId: string): Promise<void> {
    await this.get(sessionId);
    return await this.controller.store.delete(sessionId);
  }
}
