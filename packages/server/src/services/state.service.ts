import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IState, StateStatus, StateType } from '@interfaces/state.interface';
import Session from '@models/session.model';
import State from '@models/state.model';
import Event from '@models/event.model';

export default class StateService {
  private path: string;
  private controller: BaseController<IState>;
  constructor() {
    this.path = 'state';
    this.controller = new BaseController<IState>('db', State);
  }

  async create(data: IState): Promise<IState> {
    return await this.controller.store.create(' ', data);
  }

  async update(stateId: string, data: IState): Promise<IState> {
    return await this.controller.store.update(stateId, data);
  }

  async get(stateId: string): Promise<IState> {
    const findState = await this.controller.store.findById(stateId);
    if (!findState) throw new HttpException(404, 'state not found');
    return findState;
  }

  async findOne(query: {}): Promise<IState> {
    const findState = await this.controller.store.findOne(query);
    if (!findState) throw new HttpException(404, 'state not found');
    return findState;
  }

  async getAll(d: {
    eventId?: string;
    sessionId?: string;
    eventSlug?: string;
    type?: StateType;
    status?: StateStatus;
  }): Promise<Array<IState>> {
    let filter = {};
    if (d.eventId != undefined) {
      let event = await Event.findOne({ slug: d.eventId });
      filter = { ...filter, eventId: event?._id };
    }
    if (d.sessionId != undefined) {
      let session = await Session.findOne({ slug: d.sessionId });
      filter = { ...filter, sessionId: session?._id };
    }
    if (d.eventSlug != undefined) {
      filter = { ...filter, eventSlug: d.eventSlug };
    }
    if (d.type != undefined) {
      filter = { ...filter, type: d.type };
    }
    if (d.status != undefined) {
      filter = { ...filter, status: d.status };
    }

    const [states] = await Promise.all([
      await this.controller.store.findAll(filter, this.path),
      await this.controller.store.findAll(filter, this.path, 0, 0),
    ]);

    return states;
  }
}
