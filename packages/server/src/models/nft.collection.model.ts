import {
  INftCollection,
  NftCollectionType,
} from '@interfaces/nft.collection.interface';
import { Schema, model } from 'mongoose';

const NftSchema = new Schema<INftCollection>(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    type: { type: String, enum: Object.keys(NftCollectionType) },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    videos: [
      {
        type: { type: String, default: '' },
        stageId: { type: Schema.Types.ObjectId, ref: 'Stage' },
        sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const NftCollection = model<INftCollection>('Nft-Collection', NftSchema);
export default NftCollection;
