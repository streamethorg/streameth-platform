import { IStage } from '@interfaces/stage.interface';
import { Schema, model } from 'mongoose';

const StageSchema = new Schema<IStage>(
  {
    name: { type: String, default: '', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    streamSettings: {
      streamId: { type: String, default: '' },
    },
    plugins: [
      {
        name: { type: String },
      },
    ],
    order: { type: Number, default: 0 },
    slug: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

const Stage = model<IStage>('Stage', StageSchema);
export default Stage;
