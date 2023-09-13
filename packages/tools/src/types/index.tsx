export interface ISpeaker {
  id: string
  name: string
  bio: string | null
  eventId: IEvent['id']
  twitter?: string
  github?: string
  website?: string
  photo?: string
}

export interface IOrganization {
  id: string
  name: string
  description: string
  url: string
  logo: string
  location: string
}

export interface GSheetConfig {
  sheetId: string
  apiKey: string
}

export interface PretalxConfig {
  url: string
  apiToken: string
}

export type IDataImporter = { type: 'gsheet'; config: GSheetConfig } | { type: 'pretalx'; config: PretalxConfig }

export interface IEvent {
  id: string
  name: string
  description: string
  start: Date
  end: Date
  location: string
  organizationId: IOrganization['id']
  dataImporter?: IDataImporter[]
  eventCover?: string
  archiveMode?: boolean
  website?: string
}

export interface IStreamSettings {
  streamId: string
}

export interface IPlugin {
  name: string
}

export interface IStage {
  id: string
  name: string
  eventId: IEvent['id']
  streamSettings: IStreamSettings
  plugins?: IPlugin[]
  order?: number
}

export interface ISession {
  id: string
  name: string
  description: string
  start: Date
  end: Date
  stageId: IStage['id']
  speakers?: ISpeaker[]
  videoUrl?: string
  playbackId?: string
  eventId: IEvent['id']
  track?: string[]
  coverImage?: string
}
