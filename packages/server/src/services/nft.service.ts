import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { INftCollection } from '@interfaces/nft.collection.interface';
import NftCollection from '@models/nft.collection.model';
import SessionService from './session.service';
import StageService from './stage.service';
import { uploadMultipleMetadata, uploadSingleMetadata } from '@utils/storage';

export default class CollectionService {
  private path: string;
  private controller: BaseController<INftCollection>;
  private sessionService = new SessionService();
  private stageService = new StageService();

  constructor() {
    this.path = 'collections';
    this.controller = new BaseController<INftCollection>('db', NftCollection);
  }

  async create(data: INftCollection): Promise<INftCollection> {
    if (data.type == 'single') {
      let video = data.videos[0];
      let metadata = await this.getMetadata({
        type: video.type,
        sessionId: video.sessionId,
        stageId: video.stageId,
      });
      let url = await uploadSingleMetadata(JSON.stringify(metadata));
      data.videos.map((video) => (video.ipfsURI = url));
      data.ipfsPath = this.getIpfsPath(url);
    }
    if (data.type == 'multiple') {
      let files = [];
      for (const video of data.videos) {
        let metadata = await this.getMetadata({
          type: video.type,
          sessionId: video.sessionId,
          stageId: video.stageId,
        });
        files.push(metadata);
      }
      let urls = await uploadMultipleMetadata(files);
      data.videos.map((video, index) => (video.ipfsURI = urls[index]));
      data.ipfsPath = this.getIpfsPath(urls[0]);
    }
    return await this.controller.store.create(
      data.name,
      data,
      `${this.path}/${data.organizationId}`,
    );
  }

  async update(
    collectionId: string,
    data: INftCollection,
  ): Promise<INftCollection> {
    return await this.controller.store.update(collectionId, data, data.name);
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

  private async getMetadata(data: {
    type: string;
    sessionId?: string;
    stageId: string;
  }) {
    if (data.type == 'livestream') {
      return await this.stageService.createMetadata(data.stageId);
    }
    if (data.type == 'video') {
      return await this.sessionService.createMetadata(data.sessionId);
    }
  }

  private getIpfsPath(url: string): string {
    const lastSlashIndex = url.lastIndexOf('/');
    return url.substring(0, lastSlashIndex + 1);
  }
}
