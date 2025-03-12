import { IOrganizationModel } from '@interfaces/organization.interface';
import { Schema, model } from 'mongoose';

const OrganizationSchema = new Schema<IOrganizationModel>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    email: { type: String, default: '', required: true, index: true },
    description: { type: String, default: '' },
    url: { type: String, default: '' },
    logo: { type: String, default: '', required: true },
    banner: { type: String, default: '' },
    location: { type: String, default: '' },
    accentColor: { type: String, default: '' },
    slug: { type: String, default: '', index: true },
    invitationCode: { type: String, unique: true, sparse: true },
    socials: [
      {
        type: { type: String, default: '' },
        accessToken: { type: String, default: '' },
        refreshToken: { type: String, default: '' },
        expireTime: { type: Number, default: '' },
        name: { type: String, default: '' },
        thumbnail: { type: String, default: '' },
        channelId: { type: String, default: '' },
      },
    ],
    customerId: { type: String },
    
    // Subscription tier fields
    subscriptionTier: { type: String, enum: ['free', 'creator', 'pro', 'studio', 'none'], default: 'free' },
    subscriptionStatus: { type: String, enum: ['active', 'past_due', 'canceled', 'unpaid', 'trialing', 'none'], default: 'none' },
    subscriptionPeriodEnd: { type: Date },
    maxVideoLibrarySize: { type: Number, default: 5 }, // Free tier default
    currentVideoCount: { type: Number, default: 0 }, // Current videos in library
    maxSeats: { type: Number, default: 1 }, // Free tier default
    isMultistreamEnabled: { type: Boolean, default: false },
    isCustomChannelEnabled: { type: Boolean, default: false },
    isWhiteLabelEnabled: { type: Boolean, default: false },
    hasPrioritySupport: { type: Boolean, default: false },
    
    // Invoice information
    latestInvoice: {
      id: { type: String },
      number: { type: String },
      hostedInvoiceUrl: { type: String },
      invoicePdf: { type: String },
      total: { type: Number },
      currency: { type: String },
      status: { type: String },
      paidAt: { type: Number },
      receiptNumber: { type: String },
      createdAt: { type: Number }
    }
  },
  {
    timestamps: true,
  },
);

const Organization = model<IOrganizationModel>(
  'Organization',
  OrganizationSchema,
);

export default Organization;
