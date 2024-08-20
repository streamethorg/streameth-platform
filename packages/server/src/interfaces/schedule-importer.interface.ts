import { Types } from 'mongoose';
import { ISession } from './session.interface';
import { IStage } from './stage.interface';

export enum ImportType {
  gsheet = 'gsheet',
  pretalx = 'pretalx',
}

export enum ImportStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}
export interface IScheduleImportMetadata {
  sessions: ISession[];
  rooms: IStage[];
}
export interface IScheduleImporter {
  url: string;
  type: ImportType;
  status: ImportStatus;
  organizationId: Types.ObjectId | string;
  stageId?: Types.ObjectId | string;
  metadata: IScheduleImportMetadata;
}
