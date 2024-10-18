import type { Document, Types } from 'mongoose';
import type { ISpeaker } from './speaker.interface';

export interface ISource {
  streamUrl?: string;
  start?: number;
  end?: number;
}

export interface IPlayback {
  livepeerId?: string;
  videoUrl?: string;
  ipfsHash?: string;
  format?: string;
  duration?: number;
}

export enum SessionType {
  clip = 'clip',
  livestream = 'livestream',
  video = 'video',
}

export enum ProcessingStatus {
  pending = 'pending',
  failed = 'failed',
  completed = 'completed',
}

export interface ISession {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  start: number;
  end: number;
  startClipTime?: number;
  endClipTime?: number;
  stageId?: Types.ObjectId | string;
  speakers?: Omit<ISpeaker, 'organizationId'>[];
  source?: ISource;
  assetId?: string;
  playback?: IPlayback;
  videoUrl?: string;
  playbackId?: string;
  eventId?: Types.ObjectId | string;
  organizationId: Types.ObjectId | string;
  track?: string[];
  coverImage?: string;
  slug?: string;
  eventSlug?: string;
  videoTranscription?: string;
  aiDescription?: string;
  autoLabels?: string[];
  ipfsURI?: string;
  mintable?: boolean;
  published?: boolean;
  type: SessionType;
  createdAt?: Date | string;
  nftCollections?: Types.ObjectId | string[];
  socials?: { name: string; date: number }[];
  firebaseId?: string;
  talkType?: string;
  processingStatus?: ProcessingStatus;
  transcripts?: {
    subtitleUrl: string;
    chunks: {
      timestamp: number[];
      text: string;
    }[];
    text: string;
  };
}

export interface ISessionModel extends Omit<ISession, '_id'>, Document {}
