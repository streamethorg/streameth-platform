import { Document, Types } from 'mongoose';

export interface IFrom {
  identity: string;
}

export interface IChat {
  stageId: Types.ObjectId | string;
  message: string;
  from: IFrom;
  timestamp: number;
}

export interface IChatModel extends IChat, Document {}
