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

export type SubscriptionTier = 'free' | 'creator' | 'pro' | 'studio' | 'none';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing' | 'none' | 'canceling';

export interface InvoiceData {
  id: string;
  number: string;
  hostedInvoiceUrl: string;
  invoicePdf: string;
  total: number;
  currency: string;
  status: string;
  paidAt: number;
  receiptNumber?: string;
  createdAt: number;
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
  address?: string;
  invitationCode?: string;
  socials?: ISocials[];
  customerId?: string;
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPeriodEnd?: Date;
  maxVideoLibrarySize?: number;
  currentVideoCount?: number;
  maxSeats?: number;
  isLivestreamingEnabled?: boolean;
  isMultistreamEnabled?: boolean;
  isCustomChannelEnabled?: boolean;
  hasPrioritySupport?: boolean;
  latestInvoice?: InvoiceData;
}

export type IOrganizationUpdate = Partial<IOrganization>;

export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
