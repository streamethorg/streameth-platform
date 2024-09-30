import { IMarker } from '@interfaces/marker.interface';
import { model, Schema } from 'mongoose';

const MarkerSchema = new Schema<IMarker>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    stageId: { type: Schema.Types.ObjectId, index: true, ref: 'Stage' },
    start: { type: Number, default: 0, required: true },
    end: { type: Number, default: 0, required: true },
    startClipTime: { type: Number, default: 0, required: true },
    endClipTime: { type: Number, default: 0, required: true },
    date: { type: String, default: '', required: true },
    color: { type: String, default: '#FFA500', required: true },
    speakers: [
      {
        name: { type: String, default: '' },
        photo: { type: String, default: '' },
        bio: { type: String, default: '' },
        twitter: { type: String, default: '' },
        organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
      },
    ],
    slug: { type: String, default: '', index: true },
  },
  {
    timestamps: true,
  },
);

const Markers = model<IMarker>('Markers', MarkerSchema);

export default Markers;
