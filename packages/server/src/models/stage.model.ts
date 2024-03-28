import { IStageModel } from '@interfaces/stage.interface';
import { Schema, model } from 'mongoose';

export const StageSchema = new Schema<IStageModel>(
  {
    name: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    streamSettings: {
      streamId: { type: String, default: '' },
      parentId: { type: String, default: '' },
      playbackId: { type: String, default: '' },
    },
    plugins: [
      {
        name: { type: String },
      },
    ],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    slug: { type: String, default: '', index: true },
  },
  {
    timestamps: true,
  },
);

const Stage = model<IStageModel>('Stage', StageSchema);
export default Stage;
