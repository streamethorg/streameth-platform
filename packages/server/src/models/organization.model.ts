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
    paymentStatus: { type: String, enum: ['none', 'pending', 'processing', 'active', 'failed'], default: 'none' },
    customerId: { type: String },
    streamingDays: { type: Number },
    paidStages: { type: Number, default: 0 },
    currentStages: { type: Number, default: 0 },
    lastPaymentAmount: { type: Number },
    lastPaymentDate: { type: Date },
    lastPaymentError: { type: String },
    lastPaymentIntentId: { type: String },
    lastCheckoutSessionId: { type: String },
    expirationDate: { type: Date },
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
