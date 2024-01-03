import { Document, Types } from 'mongoose';

export interface GSheetConfig {
  sheetId?: string;
  apiKey?: string;
  driveId?: string;
  driveApiKey?: string;
}
export interface PretalxConfig {
  url: string;
  apiToken: string;
}

export type IDataImporter =
  | { type: 'gsheet'; config: GSheetConfig }
  | { type: 'pretalx'; config: PretalxConfig };
export type IDataExporter = { type: 'gdrive'; config: GSheetConfig };

export interface IPlugins {
  disableChat: boolean;
}

export interface IEvent extends Document {
  name: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  logo?: string;
  banner?: string;
  startTime?: string;
  endTime?: string;
  organizationId: Types.ObjectId | string;
  dataImporter?: IDataImporter[];
  eventCover?: string;
  archiveMode?: boolean;
  website?: string;
  timezone: string;
  accentColor?: string;
  unlisted?: boolean;
  dataExporter?: IDataExporter[];
  enableVideoDownloader?: boolean;
  plugins?: IPlugins;
}
