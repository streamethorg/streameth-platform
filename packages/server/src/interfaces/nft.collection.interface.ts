import { Types } from 'mongoose';

export enum NftCollectionType {
  single = 'single',
  multiple = 'multiple',
}
export interface INftCollection {
  name: string;
  description: string;
  thumbnail: string;
  type: NftCollectionType;
  organizationId: Types.ObjectId | string;
  videos: {
    type: string;
    sessionId?: string;
    stageId?: string;
    ipfsURI?: string;
  }[];
  contractAddress?: string;
}
