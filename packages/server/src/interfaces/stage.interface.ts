import { Document, Types } from 'mongoose';

export interface TargetOutput {
  profile: string;
  videOnly?: boolean;
  id?: string;
}
export interface IStreamSettings {
  streamId?: string;
  parentId?: string;
  playbackId?: string;
  isHealthy?: boolean;
  targets?: TargetOutput[];
}

export interface IPlugin {
  name: string;
}

export class IStage {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  eventId?: Types.ObjectId | string;
  streamSettings?: IStreamSettings;
  plugins?: IPlugin[];
  order?: number;
  slug?: string;
  published?: boolean;
  organizationId: Types.ObjectId | string;
}

export interface IStageModel extends Omit<IStage, '_id'>, Document {}
