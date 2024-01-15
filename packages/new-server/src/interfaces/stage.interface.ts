import { Document, Types } from 'mongoose';

export interface IStreamSettings {
  streamId: string;
}

export interface IPlugin {
  name: string;
}

export class IStage {
  name: string;
  eventId: Types.ObjectId | string;
  streamSettings: IStreamSettings;
  plugins?: IPlugin[];
  order?: number;
  slug?: string;
  entity?: string;
}

export interface IStageModel extends IStage, Document {}
