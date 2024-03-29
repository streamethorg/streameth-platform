import { Document, Types } from 'mongoose';

export interface ISpeaker {
  _id?: string;
  name: string;
  bio: string;
  eventId?: Types.ObjectId | string;
  twitter?: string;
  github?: string;
  website?: string;
  photo?: string;
  company?: string;
  slug?: string;
  organizationId: Types.ObjectId | string;
}

export interface ISpeakerModel extends Omit<ISpeaker, '_id'>, Document {}
