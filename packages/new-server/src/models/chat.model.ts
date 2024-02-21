import { IChatModel } from '@interfaces/chat.interface';
import { Schema, model } from 'mongoose';

const ChatSchema = new Schema<IChatModel>({
  stageId: { type: Schema.Types.ObjectId, ref: 'Stage' },
  message: { type: String, default: '', required: true },
  from: {
    identity: { type: String, default: '', required: true },
  },
  timestamp: { type: Number, required: true },
});

const Chat = model<IChatModel>('Chat', ChatSchema);
export default Chat;
