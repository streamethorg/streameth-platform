import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IEvent } from '@interfaces/event.interface';
import Events from '@models/event.model';

export default class EventService {
  private path: string;
  private controller: BaseController<IEvent>;
  constructor() {
    this.path = 'events';
    this.controller = new BaseController<IEvent>('fs', Events);
  }

  async create(data: IEvent): Promise<IEvent> {
    const findEvent = await this.controller.store.findOne(
      { name: data.name },
      `${this.path}/${data.organizationId}`,
    );
    if (findEvent) throw new HttpException(409, 'Event already exists');
    return this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.organizationId}`,
    );
  }

  async update(eventId: string, event: IEvent): Promise<IEvent> {
    return await this.controller.store.update(eventId, event, this.path);
  }

  async get(eventId: string): Promise<IEvent> {
    const findEvent = await this.controller.store.findById(eventId, this.path);
    if (!findEvent) throw new HttpException(404, 'Event not found');
    return findEvent;
  }

  async getAll(): Promise<Array<IEvent>> {
    return await this.controller.store.findAll({}, this.path);
  }

  async findAllOwnedEvents(organizationId: string): Promise<Array<IEvent>> {
    return await this.controller.store.findAll(
      { organizationId: organizationId },
      `${this.path}/${organizationId}`,
    );
  }
  async deleteOne(eventId: string): Promise<void> {
    await this.get(eventId);
    return await this.controller.store.delete(eventId, this.path);
  }
}
