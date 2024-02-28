import { Document, Types } from 'mongoose';

export interface ISupport {
  message: string;
}

export interface ISupportModel extends ISupport, Document {}
