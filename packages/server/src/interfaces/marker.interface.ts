import { Types } from 'mongoose';
import { ISpeaker } from './speaker.interface';

export interface IMarker {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  organizationId: Types.ObjectId | string;
  stageId: Types.ObjectId | string;
  start: number;
  end: number;
  date: string;
  color: string;
  speakers?: ISpeaker[];
  slug?: string;
}
