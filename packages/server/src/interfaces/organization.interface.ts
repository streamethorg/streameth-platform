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

export type PaymentStatus = 'none' | 'pending' | 'processing' | 'active' | 'failed';

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
  address?: string;
  invitationCode?: string;
  socials?: ISocials[];
  // Payment related fields
  paymentStatus?: PaymentStatus;
  customerId?: string;
  streamingDays?: number;
  paidStages?: number;
  currentStages?: number;
  lastPaymentAmount?: number;
  lastPaymentDate?: Date;
  lastPaymentError?: string;
  lastPaymentIntentId?: string;
  lastCheckoutSessionId?: string;
  expirationDate?: Date; // When the streaming access expires
}

export type IOrganizationUpdate = Partial<IOrganization>;

export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
