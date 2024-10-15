import { IAnimation } from '@interfaces/animation.interface';
import { model, Schema } from 'mongoose';

const AnimationSchema = new Schema<IAnimation>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    sessionId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Session',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Organization',
      required: true,
    },
    assetId: { type: String, index: true, required: true },
    playbackId: { type: String, required: true },
    slug: { type: String, index: true, required: true },
  },
  {
    timestamps: true,
  },
);

const Animation = model<IAnimation>('Animation', AnimationSchema);
export default Animation;
