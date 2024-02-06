import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IUser } from '@interfaces/user.interface';
import User from '@models/user.model';

export default class UserService {
  private path: string;
  private controller: BaseController<IUser>;
  constructor() {
    this.path = 'users';
    this.controller = new BaseController<IUser>('db', User);
  }

  async create(data: IUser): Promise<IUser> {
    return this.controller.store.create('', data, this.path);
  }
  async get(id: string): Promise<IUser> {
    const findUser = await User.findById(id).populate('organizations');
    if (!findUser) throw new HttpException(404, 'User not found');
    return findUser;
  }

  async findOne(query: {}): Promise<IUser> {
    return await this.controller.store.findOne(query);
  }
}
