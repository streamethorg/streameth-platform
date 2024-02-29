import { ISupportModel } from '@interfaces/support.interface';
import { Schema, model } from 'mongoose';

const SupportSchema = new Schema<ISupportModel>({
  message: { type: String, default: '', required: true },
  telegram: { type: String, default: '' },
  email: { type: String, default: '' },
});

const Support = model<ISupportModel>('Support', SupportSchema);
export default Support;
