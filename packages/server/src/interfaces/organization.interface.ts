import { Document, Types } from 'mongoose';

export interface ISocials {
  _id?: string;
  type: string;
  accessToken: string;
  refreshToken: string;
  expireTime: number;
  name: string;
  thumbnail?: string;
  channelId?: string;
}
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
  address?: string;
  socials?: ISocials[];
}
export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
