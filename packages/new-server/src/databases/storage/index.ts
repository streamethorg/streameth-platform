import FsController from './fs';
import DbController from './db';
import mongoose from 'mongoose';
import { IStorageController } from '@interfaces/storage.interface';

export type StoreType = 'fs' | 'db';
export default class BaseController<
  T extends mongoose.Document<any, any, any>,
> {
  private storage: IStorageController<T>;

  constructor(storeType: StoreType, model?: mongoose.Model<T>) {
    switch (storeType) {
      case 'fs':
        this.storage = new FsController<T>();
        break;
      case 'db':
        this.storage = new DbController<T>(model);
        break;
      default:
        throw new Error(`Unsupported store type: ${storeType}`);
    }
  }

  get store(): IStorageController<T> {
    return this.storage;
  }
}
