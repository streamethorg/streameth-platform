import { Document } from 'mongoose';
export interface IOrganization {
  name: string;
  description: string;
  url: string;
  logo: string;
  location: string;
  accentColor?: string;
  slug?: string;
  entity?: string;
}
export interface IOrganizationModel extends IOrganization, Document {}
