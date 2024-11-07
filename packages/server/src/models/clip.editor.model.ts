import {
  ClipEditorStatus,
  IClipEditor,
} from '@interfaces/clip.editor.interface';
import { model, Schema } from 'mongoose';

const ClipEditorSchema = new Schema<IClipEditor>(
  {
    renderId: { type: String, default: '', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    stageId: { type: Schema.Types.ObjectId, ref: 'Stage' },
    frameRate: { type: Number, default: 30 },
    events: [
      {
        label: { type: String, default: '' },
        sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
      },
    ],
    selectedAspectRatio: { type: String, default: '16:9' },
    captionEnabled: { type: Boolean, default: false },
    captionPosition: { type: String, default: 'bottom' },
    captionLinesPerPage: { type: Number, default: 3 },
    captionFont: { type: String, default: 'Arial' },
    captionColor: { type: String, default: '#000' },
    clipSessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    statusMessage: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.keys(ClipEditorStatus),
      default: ClipEditorStatus.pending,
    },
  },
  {
    timestamps: true,
  },
);

const ClipEditor = model<IClipEditor>('ClipEditor', ClipEditorSchema);
export default ClipEditor;
