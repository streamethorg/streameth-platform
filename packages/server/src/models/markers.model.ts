import { IMarker } from '@interfaces/marker.interface';
import { model, Schema } from 'mongoose';

const MarkerSchema = new Schema<IMarker>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    slug: { type: String, default: '', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    metadata: [
      {
        start: { type: Number, default: 0, required: true },
        end: { type: Number, default: 0, required: true },
        color: { type: String, default: '#FFA500', required: true },
        title: { type: String, default: '', required: true },
        description: { type: String, default: '', required: true },
        speakers: [
          {
            name: { type: String, default: '' },
            photo: { type: String, default: '' },
            bio: { type: String, default: '' },
            twitter: { type: String, default: '' },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Markers = model<IMarker>('Markers', MarkerSchema);

export default Markers;
