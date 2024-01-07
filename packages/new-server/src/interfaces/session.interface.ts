import { Document, Types } from 'mongoose';

export interface ISource {
  streamUrl: string;
  start: number;
  end: number;
}

export interface ISpeaker {
  name: string;
  bio: string;
  eventId: Types.ObjectId | string;
  twitter?: string;
  github?: string;
  website?: string;
  photo?: string;
  company?: string;
}

export interface IPlayback {
  livepeerId: string;
  videoUrl: string;
  ipfsHash: string;
  format: string;
  duration: number;
}

export class ISession extends Document {
  name: string;
  description: string;
  start: number;
  end: number;
  stageId: Types.ObjectId | string;
  speakers: ISpeaker[];
  source?: ISource;
  playback?: IPlayback;
  videoUrl?: string;
  playbackId?: string;
  eventId: Types.ObjectId | string;
  track?: string[];
  coverImage?: string;
  slug: string;
}
