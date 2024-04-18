import { Document, Types } from 'mongoose';

export interface GSheetConfig {
  sheetId?: string;
  apiKey?: string;
  driveId?: string;
  driveApiKey?: string;
  url?: string;
}
export interface PretalxConfig {
  url?: string;
  apiToken: string;
  sheetId?: string;
}

export type IDataImporter =
  | { type: 'gsheet'; config: GSheetConfig }
  | { type: 'pretalx'; config: PretalxConfig };
export type IDataExporter = { type: 'gdrive'; config: GSheetConfig };

export interface IPlugins {
  disableChat: boolean;
  hideSchedule?: boolean;
}

export interface IEventNFT {
  address?: string;
  name?: string;
  symbol?: string;
  uri?: string;
  maxSupply?: string;
  mintFee?: string;
  startTime?: string;
  endTime?: string;
}

export interface IEvent {
  _id?: Types.ObjectId | string;
  name: string;
  description: string;
  start: Date | string;
  end: Date | string;
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
  slug?: string;
  eventNFT?: IEventNFT;
}
export interface IEventModel extends Omit<IEvent, '_id'>, Document {}
