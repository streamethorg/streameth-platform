import { IEventModel } from '@interfaces/event.interface';
import { Schema, model } from 'mongoose';

const EventSchema = new Schema<IEventModel>(
  {
    name: { type: String, default: '', required: true, maxlength: 255 },
    description: { type: String, default: '', required: true },
    start: { type: Date },
    end: { type: Date },
    location: { type: String, default: '', required: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    dataImporter: [
      {
        _id: false,
        type: { type: String, default: '' },
        config: { type: {} },
      },
    ],
    eventCover: { type: String, default: '' },
    archiveMode: { type: Boolean, default: false },
    website: { type: String, default: '' },
    timezone: { type: String, default: '' },
    accentColor: { type: String, default: '' },
    unlisted: { type: Boolean, default: false },
    dataExporter: [
      {
        _id: false,
        type: { type: String, default: '' },
        config: { type: {} },
      },
    ],
    enableVideoDownloader: { type: Boolean, default: false },
    plugins: {
      disableChat: { type: Boolean, default: false },
    },
    slug: { type: String, default: '' },
    entity: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

const Event = model<IEventModel>('Event', EventSchema);
export default Event;
