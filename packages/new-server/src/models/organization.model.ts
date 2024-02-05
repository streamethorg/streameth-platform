import { IOrganizationModel } from '@interfaces/organization.interface';
import { Schema, model } from 'mongoose';

const OrganizationSchema = new Schema<IOrganizationModel>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '', required: true },
    url: { type: String, default: '', required: true },
    logo: { type: String, default: '', required: true },
    location: { type: String, default: '', required: true },
    accentColor: { type: String, default: '' },
    slug: { type: String, default: '', index: true },
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
