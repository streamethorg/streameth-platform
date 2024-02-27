import { Document } from 'mongoose';
import { IOrganization } from './organization.interface';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
export interface IUser {
  walletAddress: string;
  organizations?: IOrganization[];
  role?: UserRole;
  signature: string;
  nonce: string;
  message: string;
}
export interface IUserModel extends IUser, Document {}
