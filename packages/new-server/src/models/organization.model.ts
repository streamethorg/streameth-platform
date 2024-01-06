import { IOrganization } from '@interfaces/organization.interface';
import { Schema, model } from 'mongoose';

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '', required: true, maxlength: 255 },
    url: { type: String, default: '', required: true },
    logo: { type: String, default: '', required: true },
    location: { type: String, default: '', required: true },
    accentColor: { type: String, default: '' },
    slug: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

const Organization = model<IOrganization>('Organization', OrganizationSchema);

export default Organization;
