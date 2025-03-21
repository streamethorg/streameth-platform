import { IStageModel, StageType } from '@interfaces/stage.interface';
import { Schema, model } from 'mongoose';

export const StageSchema = new Schema<IStageModel>(
  {
    name: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    streamSettings: {
      streamId: { type: String, default: '' },
      streamKey: { type: String, default: '' },
      parentId: { type: String, default: '' },
      playbackId: { type: String, default: '' },
      isActive: { type: Boolean, default: false },
      isHealthy: { type: Boolean, default: false },
      targets: [
        {
          id: { type: String },
          name: { type: String },
          socialId: { type: String },
          socialType: { type: String },
          broadcastId: { type: String },
        },
      ],
    },
    plugins: [
      {
        name: { type: String },
      },
    ],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    isMultipleDate: { type: Boolean, default: false },
    slug: { type: String, default: '', index: true },
    streamDate: { type: Date, default: Date.now() },
    streamEndDate: { type: Date, default: Date.now() },
    mintable: { type: Boolean, default: false },
    nftCollections: [{ type: String, ref: 'Nft-Collection' }],
    recordingIndex: { type: Number, default: 0 },
    source: {
      url: { type: String, default: '' },
      m3u8Url: { type: String, default: '' },
      type: { type: String, default: '' },
    },
    type: {
      type: String,
      enum: Object.keys(StageType),
      default: StageType.livepeer,
    },
    transcripts: {
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      chunks: [
        {
          start: { type: Number },
          end: { type: Number },
          word: { type: String },
        },
      ],
      text: { type: String },
      lastSegmentTimestamp: { type: Number },
    },
  },
  {
    timestamps: true,
  },
);

const Stage = model<IStageModel>('Stage', StageSchema);
export default Stage;
