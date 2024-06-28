import { Types } from 'mongoose';

export interface IUploadSession {
  socialId: string;
  organizationId: string | Types.ObjectId;
  sessionId: string | Types.ObjectId;
  token?: string;
  type: string;
}
