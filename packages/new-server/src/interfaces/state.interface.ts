import { Types } from 'mongoose';

export enum SheetType {
  gsheet = 'gsheet',
  pretalx = 'pretalx',
}

export enum StateStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
  imported = 'imported',
}

export enum StateType {
  event = 'event',
  youtube = 'youtube',
}
export interface IState {
  eventId: string | Types.ObjectId;
  eventSlug: string;
  sheetType: SheetType;
  status: StateStatus;
  type: StateType;
}
