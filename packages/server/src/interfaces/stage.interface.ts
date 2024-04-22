import { Document, Types } from 'mongoose';

export interface TargetOutput {
  id?: string;
  name?: string;
}
export interface IStreamSettings {
  streamId?: string;
  parentId?: string;
  playbackId?: string;
  isHealthy?: boolean;
  isActive?: boolean;
  streamKey?: string;
  ipfshash?: string;
  targets?: TargetOutput[]; // stream?.multistream?.targets
}

export interface IPlugin {
  name: string;
}

export class IStage {
  _id?: Types.ObjectId | string;
  name: string;
  description?: string;
  eventId?: Types.ObjectId | string;
  streamSettings?: IStreamSettings;
  plugins?: IPlugin[];
  order?: number;
  slug?: string;
  published?: boolean;
  organizationId: Types.ObjectId | string;
  thumbnail?: string;
  streamDate?: Date | string;
  mintable?: boolean;
  createdAt?: string;
  nftCollections?: Types.ObjectId[] | string[];
}

export interface IStageModel extends Omit<IStage, '_id'>, Document {}
