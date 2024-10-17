import {
  ClippingStatus,
  type ISessionModel,
  SessionType,
} from '@interfaces/session.interface';
import { Schema, model } from 'mongoose';

const SessionSchema = new Schema<ISessionModel>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '' },
    start: { type: Number },
    end: { type: Number },
    startClipTime: { type: Number },
    endClipTime: { type: Number },
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
    slug: { type: String, default: '', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    eventSlug: { type: String, default: '' },
    videoTranscription: { type: String, default: '' },
    aiDescription: { type: String, default: '' },
    autoLabels: [{ type: String }],
    ipfsURI: { type: String, default: '' },
    mintable: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    type: { type: String, enum: Object.keys(SessionType) },
    nftCollections: [{ type: String, ref: 'Nft-Collection' }],
    socials: [
      {
        name: { type: String, default: '' },
        date: { type: Number, default: 0 },
      },
    ],
    firebaseId: { type: String, default: '' },
    talkType: { type: String, default: '' },
    clippingStatus: { type: String, enum: Object.keys(ClippingStatus) },
    transcripts: {
      subtitleUrl: { type: String, default: '' },
      chunks: [
        {
          text: { type: String, default: '' },
          tiimestamp: [{ type: Number }],
        },
      ],
      text: { type: String, default: '' },
    },
    animation: {
      label: { type: String, default: '' },
      type: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Session = model<ISessionModel>('Session', SessionSchema);
export default Session;
