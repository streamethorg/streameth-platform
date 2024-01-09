import { Document, Types } from 'mongoose';
import { ISpeaker } from './speaker.interface';

export interface ISource {
  streamUrl: string;
  start: number;
  end: number;
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
