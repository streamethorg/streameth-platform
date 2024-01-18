import { IStorageController } from '@interfaces/storage.interface';
import mongoose, { Types } from 'mongoose';
import { generateId } from '@utils/util';

export default class DB<T> implements IStorageController<T> {
  private model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }
  async create(query: string, data: T): Promise<T> {
    return await this.model.create({ ...data, slug: generateId(query) });
  }

  async update(id: string, data: T): Promise<T> {
    const update = await this.model.findById(id);
    await update.updateOne(
      {
        ...data,
      },
      { upsert: true },
    );
    return await this.model.findById(id);
  }

  async findById(id: string): Promise<T> {
    return await this.model.findById(id);
  }

  async findOne(query: {}): Promise<T> {
    return await this.model.findOne(query);
  }

  async findAll(
    query: {},
    path: string,
    skip: number,
    pageSize: number,
  ): Promise<Array<T>> {
    return await this.model.find(query).skip(skip).limit(pageSize);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne(new Types.ObjectId(id));
  }
}
