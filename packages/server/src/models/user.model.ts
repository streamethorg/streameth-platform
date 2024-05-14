import { IUserModel, UserRole } from '@interfaces/user.interface';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema<IUserModel>(
  {
    walletAddress: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: '',
    },
    did: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: '',
    },
    organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
    role: { type: String, enum: Object.keys(UserRole), default: UserRole.user },
  },
  {
    timestamps: true,
  },
);

const User = model<IUserModel>('User', UserSchema);
export default User;
