import { Types } from 'mongoose';

export interface IClipEditor {
  renderId: string;
  organizationId: Types.ObjectId;
  stageId: Types.ObjectId;
  frameRate: number;
  events: Array<{ label: string; sessionId: string }>;
  selectedAspectRatio: string;
  captionEnabled: boolean;
  captionPosition: string;
  captionLinesPerPage: number;
  captionFont: string;
  captionColor: string;
  clipSessionId: Types.ObjectId;
}
