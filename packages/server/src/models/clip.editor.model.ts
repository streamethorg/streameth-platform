import { IClipEditor } from '@interfaces/clip.editor.interface';
import { model, Schema } from 'mongoose';

const ClipEditorSchema = new Schema<IClipEditor>(
  {
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
  },
  {
    timestamps: true,
  },
);

const ClipEditor = model<IClipEditor>('Clip', ClipEditorSchema);
export default ClipEditor;
