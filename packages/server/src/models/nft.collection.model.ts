import {
  INftCollectionModel,
  NftCollectionType,
} from '@interfaces/nft.collection.interface';
import { Schema, model } from 'mongoose';

const NftSchema = new Schema<INftCollectionModel>(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    type: { type: String, enum: Object.keys(NftCollectionType) },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    videos: [
      {
        index: { type: Number, default: 0 },
        type: { type: String, default: '' },
        stageId: { type: String, default: '' },
        sessionId: { type: String, default: '' },
        ipfsURI: { type: String, default: '' },
      },
    ],
    contractAddress: { type: String, default: '' },
    ipfsPath: { type: String, default: '' },
  },

  {
    timestamps: true,
  },
);

const NftCollection = model<INftCollectionModel>('Nft-Collection', NftSchema);
export default NftCollection;
