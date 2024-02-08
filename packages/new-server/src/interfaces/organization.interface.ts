import { Document, Types } from 'mongoose';
export interface IOrganization {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  url: string;
  logo: string;
  location: string;
  accentColor?: string;
  slug?: string;
  walletAddress: string;
}
export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
