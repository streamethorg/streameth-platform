import { IPlaylistModel } from '@interfaces/playlist.interface';
import { Schema, model } from 'mongoose';

const PlaylistSchema = new Schema<IPlaylistModel>(
  {
    organizationId: { type: Schema.Types.ObjectId, required: true, ref: 'Organization', index: true },
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Playlist = model<IPlaylistModel>('Playlist', PlaylistSchema);

export default Playlist; 