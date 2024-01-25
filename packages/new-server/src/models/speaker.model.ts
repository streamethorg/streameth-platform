import { ISpeakerModel } from '@interfaces/speaker.interface';
import { Schema, model } from 'mongoose';

const SpeakerSchema = new Schema<ISpeakerModel>(
  {
    name: { type: String, default: '', required: true },
    bio: { type: String, default: '', required: true },
    eventId: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    photo: { type: String, default: '' },
    company: { type: String, default: '' },
    slug: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);
const Speaker = model<ISpeakerModel>('Speaker', SpeakerSchema);
export default Speaker;
