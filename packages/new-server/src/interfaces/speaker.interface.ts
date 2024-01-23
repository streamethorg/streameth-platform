import { Document, Types } from 'mongoose';

export interface ISpeaker {
  name: string;
  bio: string;
  eventId: Types.ObjectId | string;
  twitter?: string;
  github?: string;
  website?: string;
  photo?: string;
  company?: string;
  slug?: string;
}

export interface ISpeakerModel extends ISpeaker, Document {}
