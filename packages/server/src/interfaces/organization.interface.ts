import { Document, Types } from 'mongoose';
export interface IOrganization {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  description?: string;
  bio?: string;
  url?: string;
  logo: string;
  location?: string;
  accentColor?: string;
  slug?: string;
  banner?: string;
  walletAddress?: string;
}
export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
