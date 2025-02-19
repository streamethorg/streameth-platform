import { Document, Types } from 'mongoose';

export interface IPlaylist {
  _id?: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  description?: string;
  sessions: Types.ObjectId[];
  isPublic: boolean;
}

export interface IPlaylistCreate {
  name: string;
  description?: string;
  sessions: string[];
  isPublic?: boolean;
}

export type IPlaylistUpdate = Partial<IPlaylistCreate>;

export interface IPlaylistModel extends Omit<IPlaylist, '_id'>, Document {} 