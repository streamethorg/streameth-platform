import type { Document, Types } from 'mongoose';

export enum SheetType {
  gsheet = 'gsheet',
  pretalx = 'pretalx',
}

export enum SocialType {
  twitter = 'twitter',
  youtube = 'youtube',
}

export enum StateStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
  sync = 'sync',
  failed = 'failed',
}

export enum StateType {
  nft = 'nft',
  event = 'event',
  video = 'video',
  transcrpition = 'transcrpition',
  social = 'social',
}

export interface IState {
  _id?: string | Types.ObjectId;
  eventId?: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
  sessionId?: string | Types.ObjectId;
  eventSlug?: string;
  sessionSlug?: string;
  sheetType?: SheetType;
  socialType?: SocialType;
  status?: StateStatus;
  type?: StateType;
}

export interface IStateModel extends Omit<IState, '_id'>, Document {}
