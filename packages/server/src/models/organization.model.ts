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
