import { Document } from 'mongoose';
export interface IOrganization extends Document {
  name: string;
  description: string;
  url: string;
  logo: string;
  location: string;
  accentColor: string;
  slug: string;
}
