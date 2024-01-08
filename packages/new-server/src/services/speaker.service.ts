import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ISpeaker } from '@interfaces/speaker.interface';
import Speaker from '@models/speaker.model';

export default class SpeakerService {
  private path: string;
  private controller: BaseController<ISpeaker>;
  constructor() {
    this.path = 'speakers';
    this.controller = new BaseController<ISpeaker>('db', Speaker);
  }

  async create(data: ISpeaker): Promise<ISpeaker> {
    return this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.eventId}`,
    );
  }

  async get(speakerId: string): Promise<ISpeaker> {
    const findSpeaker = await this.controller.store.findById(speakerId);
    if (!findSpeaker) throw new HttpException(404, 'Speaker not found');
    return findSpeaker;
  }

  async findAllSpeakersForEvent(eventId: string): Promise<Array<ISpeaker>> {
    return await this.controller.store.findAll(
      { eventId: eventId },
      `${this.path}/${eventId}`,
    );
  }
}
