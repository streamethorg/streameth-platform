import type { Document, Types } from 'mongoose';
import type { ISpeaker } from './speaker.interface';
import { TranscriptionStatus } from './state.interface';

export enum eVisibilty {
  public = 'public',
  unlisted = 'unlisted',
  private = 'private',
}

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
  video = 'video',
  livestream = 'livestream',
  clip = 'clip',
  animation = 'animation',
  editorClip = 'editorClip',
}

export enum ProcessingStatus {
  pending = 'pending',
  rendering = 'rendering',
  failed = 'failed',
  clipCreated = 'clipCreated',
  completed = 'completed',
  translating = 'translating',
  generatingAudio = 'generating_audio',
  processingVideo = 'processing_video'
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
  published?: eVisibilty;
  type: SessionType;
  createdAt?: Date | string;
  nftCollections?: Types.ObjectId | string[];
  socials?: { name: string; date: number }[];
  talkType?: string;
  processingStatus?: ProcessingStatus;
  aiAnalysis?: {
    status: ProcessingStatus;
    isVectorized: boolean;
  };
  transcripts?: {
    status: TranscriptionStatus;
    subtitleUrl: string;
    chunks: {
      start: number;
      end: number;
      word: string;
    }[];
    text: string;
    summary: string;
  };
  pretalxSessionCode?: string;
}

export interface ISessionModel extends Omit<ISession, '_id'>, Document {}
