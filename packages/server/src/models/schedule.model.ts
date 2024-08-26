import {
  ImportStatus,
  ImportType,
  IScheduleImporter,
} from '@interfaces/schedule-importer.interface';
import { model, Schema } from 'mongoose';

const ScheduleImportSchema = new Schema<IScheduleImporter>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: Object.keys(ImportType), required: true },
    status: {
      type: String,
      enum: Object.keys(ImportStatus),
      default: ImportStatus.pending,
      required: true,
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    metadata: { type: Object, required: true },
  },
  {
    timestamps: true,
  },
);

const ScheduleImport = model<IScheduleImporter>(
  'schedule-import',
  ScheduleImportSchema,
);
export default ScheduleImport;
