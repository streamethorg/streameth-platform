import { Document, Types } from 'mongoose';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
export interface IUser {
  walletAddress: string;
  organizations?: Types.ObjectId[];
  role?: UserRole;
  message?: string;
  nonce?: string;
  token?: string;
}
export interface IUserModel extends IUser, Document {}
