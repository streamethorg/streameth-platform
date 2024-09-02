import {
  IStateModel,
  SheetType,
  SocialType,
  StateStatus,
  StateType,
} from '@interfaces/state.interface';
import { Schema, model } from 'mongoose';

const StateSchema = new Schema<IStateModel>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    eventSlug: { type: String, default: '' },
    sessionSlug: { type: String, default: '' },
    sheetType: { type: String, enum: Object.keys(SheetType) },
    socialType: { type: String, enum: Object.keys(SocialType) },
    status: {
      type: String,
      default: StateStatus.pending,
      enum: Object.keys(StateStatus),
    },
    type: { type: String, enum: Object.keys(StateType) },
  },
  {
    timestamps: true,
  },
);

const State = model<IStateModel>('State', StateSchema);
export default State;
