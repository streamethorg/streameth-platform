import { Document, Types } from 'mongoose';

export interface IStreamSettings {
  streamId?: string;
  parentId?: string;
  playbackId?: string;
}

export interface IPlugin {
  name: string;
}

export class IStage {
  _id?: Types.ObjectId;
  name: string;
  eventId?: Types.ObjectId | string;
  streamSettings?: IStreamSettings;
  plugins?: IPlugin[];
  order?: number;
  slug?: string;
  published?: string;
  organizationId: Types.ObjectId | string;
}

export interface IStageModel extends Omit<IStage, '_id'>, Document {}
