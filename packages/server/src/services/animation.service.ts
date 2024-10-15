import BaseController from '@databases/storage';
import { IAnimation } from '@interfaces/animation.interface';
import Animation from '@models/animation.model';

export default class AnimationService {
  private controller: BaseController<IAnimation>;
  constructor() {
    this.controller = new BaseController<IAnimation>('db', Animation);
  }

  async create(data: IAnimation): Promise<IAnimation> {
    return this.controller.store.create(data.name, data);
  }
}
