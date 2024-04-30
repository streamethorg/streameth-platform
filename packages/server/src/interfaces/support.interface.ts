import { Document, Types } from 'mongoose';

export interface ISupport {
  message: string;
  telegram?: string;
  email?: string;
  image?: string;
}

export interface ISupportModel extends ISupport, Document {}
