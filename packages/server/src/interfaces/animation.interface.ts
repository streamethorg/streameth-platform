import { Types } from 'mongoose';

export interface IAnimation {
  name: string;
  label: string;
  type: string;
  url: string;
  sessionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  assetId: string;
  playbackId: string;
  slug?: string;
}
