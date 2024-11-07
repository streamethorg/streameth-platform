import { Types } from 'mongoose';

export enum ClipEditorStatus {
  pending = 'pending',
  failed = 'failed',
  rendering = 'rendering',
  rendered = 'rendered',
  uploading = 'uploading',
  completed = 'completed',
}
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
  status: ClipEditorStatus;
  statusMessage: string;
}
