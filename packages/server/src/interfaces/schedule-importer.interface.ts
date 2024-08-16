import { Types } from 'mongoose';

export enum ImportType {
  gsheet = 'gsheet',
  pretalx = 'pretalx',
}

export enum ImportStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}
export interface IScheduleImporter {
  url: string;
  type: ImportType;
  status: ImportStatus;
  organizationId: Types.ObjectId | string;
  metadata: {};
}
