import { Document, Types } from 'mongoose';

export interface TargetOutput {
  profile: string;
  videoOnly?: boolean;
  id?: string;
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
  streamDate?: Date;
}

export interface IStageModel extends Omit<IStage, '_id'>, Document {}
