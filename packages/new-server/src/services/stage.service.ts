import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IStage } from '@interfaces/stage.interface';
import Stage from '@models/stage.model';
import Events from '@models/event.model';

export default class StageService {
  private path: string;
  private controller: BaseController<IStage>;
  constructor() {
    this.path = 'stages';
    this.controller = new BaseController<IStage>('db', Stage);
  }

  async create(data: IStage): Promise<IStage> {
    return this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.eventId}`,
    );
  }

  async get(stageId: string): Promise<IStage> {
    const findStage = await this.controller.store.findById(stageId);
    if (!findStage) throw new HttpException(404, 'Stage not found');
    return findStage;
  }

  async getAll(): Promise<Array<IStage>> {
    return await this.controller.store.findAll({}, this.path);
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
    const event = await Events.findOne({ slug: eventId });
    return await this.controller.store.findAll(
      { eventId: event?._id },
      `${this.path}/${eventId}`,
    );
    // stages.sort((a, b) => {
    //   if (a?.order && b?.order) {
    //     return a.order - b.order
    //   }
    //   return 0
    // })
  }

  async deleteOne(stageId: string): Promise<void> {
    await this.get(stageId);
    return await this.controller.store.delete(stageId);
  }
}
