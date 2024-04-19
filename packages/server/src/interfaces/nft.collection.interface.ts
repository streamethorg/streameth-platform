import { Types } from 'mongoose';

export enum NftCollectionType {
  single = 'single',
  multiple = 'multiple',
}
export interface INftCollection {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  thumbnail: string;
  type: NftCollectionType;
  organizationId: Types.ObjectId | string;
  videos: {
    index?: number;
    type: string;
    sessionId?: string;
    stageId?: string;
    ipfsURI?: string;
  }[];
  contractAddress?: string;
  ipfsPath?: string;
}

export interface INftCollectionModel
  extends Omit<INftCollection, '_id'>,
    Document {}
