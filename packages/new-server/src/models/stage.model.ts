import { IStageModel } from '@interfaces/stage.interface';
import { Schema, model } from 'mongoose';

const StageSchema = new Schema<IStageModel>(
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
    slug: { type: String, default: '', index:true},
  },
  {
    timestamps: true,
  },
);

const Stage = model<IStageModel>('Stage', StageSchema);
export default Stage;
