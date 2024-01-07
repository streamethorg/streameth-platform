import { Document, Types } from 'mongoose';

export interface IStreamSettings {
  streamId: string;
}

export interface IPlugin {
  name: string;
}

export class IStage extends Document {
  name: string;
  eventId: Types.ObjectId;
  streamSettings: IStreamSettings;
  plugins?: IPlugin[];
  order?: number;
  slug: string;
}
