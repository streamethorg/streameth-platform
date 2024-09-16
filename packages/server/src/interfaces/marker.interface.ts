import { Types } from 'mongoose';

export interface IMarker {
  name: string;
  organizationId: Types.ObjectId | string;
  metadata: Array<{
    start: number;
    end: number;
    color: string;
    title: string;
    description: string;
  }>;
  slug?: string;
}
