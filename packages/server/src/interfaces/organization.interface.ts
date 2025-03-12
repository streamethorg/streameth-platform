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
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing' | 'none';

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
  isMultistreamEnabled?: boolean;
  isCustomChannelEnabled?: boolean;
  isWhiteLabelEnabled?: boolean;
  hasPrioritySupport?: boolean;
}

export type IOrganizationUpdate = Partial<IOrganization>;

export interface IOrganizationModel
  extends Omit<IOrganization, '_id'>,
    Document {}
