import { IsNotEmpty, IsDate, validate } from 'class-validator'
import { IOrganization } from './organization'
import { generateId, BASE_PATH } from '../utils'
import path from 'path'
export interface GSheetConfig {
  sheetId?: string
  apiKey?: string
  driveId?: string
  driveApiKey?: string
}

export interface PretalxConfig {
  url: string
  apiToken: string
}

export type IDataImporter =
  | { type: 'gsheet'; config: GSheetConfig }
  | { type: 'pretalx'; config: PretalxConfig }
export type IDataExporter = { type: 'gdrive'; config: GSheetConfig }

export interface IEvent {
  id: string
  name: string
  description: string
  start: Date
  end: Date
  location: string
  logo?: string
  banner?: string
  startTime?: string
  endTime?: string
  organizationId: IOrganization['id']
  dataImporter?: IDataImporter[]
  eventCover?: string
  archiveMode?: boolean
  website?: string
  timezone: string
  accentColor?: string
  dataExporter?: IDataExporter[]
}

export default class Event implements IEvent {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  // @IsDate()
  start: Date

  // @IsDate()
  end: Date

  logo?: string

  @IsNotEmpty()
  location: string

  @IsNotEmpty()
  organizationId: string

  dataImporter: IDataImporter[] | undefined

  dataExporter: IDataExporter[] | undefined

  eventCover?: string

  archiveMode?: boolean

  website?: string

  banner?: string

  timezone: string

  accentColor: string

  startTime?: string

  endTime?: string
  constructor({
    id,
    name,
    description,
    start,
    end,
    location,
    organizationId,
    dataImporter,
    eventCover,
    archiveMode,
    website,
    timezone,
    logo,
    banner,
    accentColor,
    dataExporter,
    startTime,
    endTime,
  }: Omit<IEvent, 'id'> & { id?: string }) {
    this.id = id ?? generateId(name)
    this.name = name
    this.description = description
    this.start = new Date(start)
    this.end = new Date(end)
    this.location = location
    this.organizationId = organizationId
    this.dataImporter = dataImporter
    this.eventCover = eventCover ? eventCover : id + '.png'
    this.website = website
    this.archiveMode = archiveMode ?? true
    this.timezone = timezone ?? 'utc'
    this.logo = logo
    this.banner = banner
    this.accentColor = accentColor ?? '#351B71'
    this.dataExporter = dataExporter
    this.startTime = startTime
    this.endTime = endTime
    // this.validateThis();
  }

  async validateThis() {
    const errors = await validate(this)
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors}`)
    }
  }

  public toJson(): IEvent {
    return { ...this }
  }

  public static async fromJson(json: string): Promise<Event> {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const evt = new Event({ ...data })
    return evt
  }

  public static async getEventPath(
    organizationId: string,
    eventId?: string
  ): Promise<string> {
    if (eventId) {
      return path.join(
        BASE_PATH,
        'events',
        organizationId,
        `${eventId}.json`
      )
    }
    return path.join(BASE_PATH, 'events', organizationId)
  }
}
