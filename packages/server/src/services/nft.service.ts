import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { INftCollection } from '@interfaces/nft.collection.interface';
import NftCollection from '@models/nft.collection.model';

export default class CollectionService {
  private path: string;
  private controller: BaseController<INftCollection>;

  constructor() {
    this.path = 'collections';
    this.controller = new BaseController<INftCollection>('db', NftCollection);
  }

  async create(data: INftCollection): Promise<INftCollection> {
    return await this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.organizationId}`,
    );
  }

  async get(collectionId: string): Promise<INftCollection> {
    const findCollection = await this.controller.store.findById(collectionId);
    if (!findCollection) throw new HttpException(404, 'Collection not found');
    return findCollection;
  }

  async getAll(): Promise<Array<INftCollection>> {
    return await this.controller.store.findAll({}, this.path);
  }

  async findAllNftForOrganization(
    organizationId: string,
  ): Promise<Array<INftCollection>> {
    return await this.controller.store.findAll({
      organizationId: organizationId,
    });
  }
}
