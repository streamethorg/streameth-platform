import { Document, Types } from 'mongoose';
import { TranscriptionStatus } from './state.interface';
export interface TargetOutput {
  _id?: string;
  id?: string;
  name?: string;
  socialId?: string;
  socialType?: string;
  broadcastId?: string;
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

export interface ILiveStream {
  stageId: string;
  socialId: string;
  socialType: string;
  organizationId: string;
}

export enum StageType {
  custom = 'custom',
  livepeer = 'livepeer',
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
  isMultipleDate?: boolean;
  organizationId: Types.ObjectId | string;
  thumbnail?: string;
  streamDate?: Date | string;
  streamEndDate?: Date | string;
  mintable?: boolean;
  createdAt?: string;
  nftCollections?: Types.ObjectId | string[];
  recordingIndex?: number;
  type?: StageType;
  transcripts?: {
    status: TranscriptionStatus;
    lastSegmentTimestamp: number;
    subtitleUrl: string;
    chunks: {
      start: number;
      end: number;
      word: string;
    }[];
    text: string;
  };
  source?: { url: string; m3u8Url: string; type: string };
}

export interface IStageModel extends Omit<IStage, '_id'>, Document {}
