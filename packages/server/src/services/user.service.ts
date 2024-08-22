import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IUser } from '@interfaces/user.interface';
import User from '@models/user.model';

export default class UserService {
  private path: string;
  private controller: BaseController;
  constructor() {
    this.path = 'users';
    this.controller = new BaseController<IUser>('db', User);
  }

  async create(data: IUser): Promise {
    return this.controller.store.create('', data, this.path);
  }
  async get(walletAddress: string): Promise {
    const findUser = await User.findOne({
      walletAddress: walletAddress,
    }).populate('organizations');
    if (!findUser) throw new HttpException(404, 'User not found');
    return findUser;
  }

  async findOne(query: {}): Promise {
    return await this.controller.store.findOne(query);
  }
}
