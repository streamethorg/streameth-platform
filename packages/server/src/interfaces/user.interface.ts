import { Document } from 'mongoose';
import { IOrganization } from './organization.interface';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
export interface IUser {
  organizations?: IOrganization[];
  role?: UserRole;
  token?: string;
  did?: string;
  email?: string;
}
export interface IUserModel extends IUser, Document {}
