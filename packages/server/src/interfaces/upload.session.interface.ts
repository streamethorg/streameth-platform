import { Types } from 'mongoose';

export interface IUploadSession {
  socialId?: string;
  organizationId?: string | Types.ObjectId;
  sessionId: string | Types.ObjectId;
  token?: { key?: string; secret: string };
  type: string;
  text?: string;
  refreshToken?: string;
}
