import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IEvent } from '@interfaces/event.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import Events from '@models/event.model';
import State from '@models/state.model';

export default class EventService {
  private path: string;
  private controller: BaseController<IEvent>;
  constructor() {
    this.path = 'events';
    this.controller = new BaseController<IEvent>('db', Events);
  }

  async create(data: IEvent): Promise<IEvent> {
    const findEvent = await this.controller.store.findOne(
      { name: data.name },
      `${this.path}/${data.organizationId}`,
    );
    if (findEvent) throw new HttpException(409, 'Event already exists');
    return await this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.organizationId}`,
    );
  }

  async update(eventId: string, data: IEvent): Promise<IEvent> {
    const event = await this.controller.store.update(eventId, data, data.name);
    return event;
  }

  async get(eventId: string): Promise<IEvent> {
    let id = '';
    const isObjectId = /[0-9a-f]{24}/i.test(eventId);
    const isPathId = /events-[a-zA-Z0-9\-_]+/.test(eventId);
    if (isObjectId) {
      id = eventId;
    }
    if (isPathId) {
      id = eventId.replace('-', '/');
    }
    if (!isObjectId && !isPathId) {
      return await this.controller.store.findOne({ slug: eventId });
    }
    const findEvent = await this.controller.store.findById(id);
    if (!findEvent) throw new HttpException(404, 'Event not found');
    return findEvent;
  }

  async getAll(d: {
    organizationId: string;
    unlisted: boolean;
  }): Promise<Array<IEvent>> {
    let filter = {};
    if (d.organizationId != undefined) {
      filter = { ...filter, organizationId: d.organizationId };
    }
    return await this.controller.store.findAll(
      { ...filter, unlisted: d.unlisted },
      this.path,
    );
  }

  async deleteOne(eventId: string): Promise<void> {
    await this.get(eventId);
    return await this.controller.store.delete(eventId);
  }

  async eventImport(eventId: string): Promise<void> {
    const findState = await State.findOne({ eventId: eventId });
    if (!findState) {
      let event = await this.get(eventId);
      await State.create({
        eventId: event._id,
        eventSlug: event.slug,
        sheetType: event.dataImporter[0].type,
        type: StateType.event,
      });
    } else {
      await findState.updateOne({
        status: StateStatus.sync,
      });
    }
  }
}
