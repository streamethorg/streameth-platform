import { Types, Document } from 'mongoose';

export enum SheetType {
  gsheet = 'gsheet',
  pretalx = 'pretalx',
}

export enum StateStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
  sync = 'sync',
}

export enum StateType {
  event = 'event',
  video = 'video',
}

export interface IState {
  _id?: string | Types.ObjectId;
  eventId?: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
  sessionId?: string | Types.ObjectId;
  eventSlug?: string;
  sessionSlug?: string;
  sheetType?: SheetType;
  status?: StateStatus;
  type?: StateType;
}

export interface IStateModel extends Omit<IState, '_id'>, Document {}
