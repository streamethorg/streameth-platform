import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IState } from '@interfaces/state.interface';
import State from '@models/state.model';

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

  async findOne(query:{}):Promise<IState>{
    const findState = await this.controller.store.findOne(query)
    if(!findState) throw new HttpException(404, ' state not found')
    return findState
  }
}
