import { ISessionModel } from '@interfaces/session.interface';
import { Schema, model } from 'mongoose';

const SessionSchema = new Schema<ISessionModel>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '', required: true },
    start: { type: Number },
    end: { type: Number },
    stageId: { type: Schema.Types.ObjectId, ref: 'Stage' },
    speakers: [
      {
        name: { type: String },
        bio: { type: String },
        eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
        twitter: { type: String, default: '' },
        github: { type: String, default: '' },
        website: { type: String, default: '' },
        photo: { type: String, default: '' },
        company: { type: String, default: '' },
      },
    ],
    source: {
      streamUrl: { type: String, default: '' },
      start: { type: Number, default: 0 },
      end: { type: Number, default: 0 },
    },
    playback: {
      livepeerId: { type: String, default: '' },
      videoUrl: { type: String, default: '' },
      ipfsHash: { type: String, default: '' },
      format: { type: String, default: '' },
      duration: { type: Number, default: 0 },
    },
    videoUrl: { type: String, default: '' },
    playbackId: { type: String, default: '' },
    assetId: { type: String, default: '' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    track: [{ type: String }],
    coverImage: { type: String, default: '' },
    slug: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    eventSlug: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

const Session = model<ISessionModel>('Session', SessionSchema);
export default Session;
