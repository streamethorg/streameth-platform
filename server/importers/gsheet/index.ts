import BaseImporter from '../baseImporter'
import { google } from 'googleapis'
import Event, { IDataImporter } from '../../model/event'
import { generateId } from '../../utils'
import moment from 'moment-timezone'

const SPEAKER_SHEET = 'Speakers'
const SPEAKER_DATA_RANGE = 'A2:D'
const STAGE_SHEET = 'Stages'
const STAGE_DATA_RANGE = 'A3:D'
const SESSION_SHEET = 'Sessions'
const SESSION_DATA_RANGE = 'A3:L'

export default class Importer extends BaseImporter {
  sheetId: string
  apiKey: string
  connection: any

  constructor({ importer, event }: { importer: IDataImporter; event: Event }) {
    super(event)
    if (importer.type !== 'gsheet') throw new Error('Invalid importer type for gsheet module')
    if (!importer.config.sheetId) throw new Error('Sheet ID is missing for gsheet module')
    if (!process.env.GOOGLE_API_KEY) throw new Error("Environment variable 'GOOGLE_API_KEY' is missing")

    this.sheetId = importer.config.sheetId
    this.apiKey = process.env.GOOGLE_API_KEY
    this.connection = this.connectToGoogleSheets()
  }

  private connectToGoogleSheets() {
    return google.sheets({
      version: 'v4',
      auth: this.apiKey,
    })
  }

  private async getDataForRange(sheetName: string, range: string): Promise<any[]> {
    const response = await this.connection.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!${range}`,
    })

    return response.data.values || []
  }

  public override async generateSpeakers(): Promise<void> {
    const data = await this.getDataForRange(SPEAKER_SHEET, SPEAKER_DATA_RANGE)
    for (const row of data) {
      const [name, description, twitterHandle, avatar] = row
      const speaker = {
        name,
        bio: description || 'No description',
        photo: avatar || undefined,
        twitter: twitterHandle,
        eventId: this.event.id,
      }

      try {
        await this.speakerController.createSpeaker(speaker)
      } catch (e) {
        console.error(`Error creating speaker:`, speaker, e)
      }
    }
  }

  public override async generateStages(): Promise<void> {
    const data = await this.getDataForRange(STAGE_SHEET, STAGE_DATA_RANGE)
    for (const row of data) {
      const [name, streamId, image] = row
      const stage = {
        name,
        eventId: this.event.id,
        streamSettings: {
          streamId,
        },
      }

      try {
        await this.stageController.createStage(stage)
      } catch (e) {
        console.error(`Error creating stage:`, stage, e)
      }
    }
  }

  public override async generateSessions(): Promise<void> {
    await Promise.all([this.generateStages(), this.generateSpeakers()])

    const data = await this.getDataForRange(SESSION_SHEET, SESSION_DATA_RANGE)

    for (const row of data) {
      try {
        const [Name, Description, stageId, Day, Start, End, ...speakerIdsRaw] = row.slice(0, 11)
        const speakerPromises = speakerIdsRaw
          .filter(Boolean)
          .map((speakerId: string) => this.speakerController.getSpeaker(generateId(speakerId), this.event.id))
        const [speakers, stage] = await Promise.all([Promise.all(speakerPromises), this.stageController.getStage(generateId(stageId), this.event.id)])

        const session = {
          name: Name,
          description: Description,
          stageId: stage.id,
          eventId: this.event.id,
          organizationId: this.event.organizationId,
          speakers: speakers,
          start: moment.tz(`${Day} ${Start}:00`, this.event.timezone).valueOf(),
          end: moment.tz(`${Day} ${End}:00`, this.event.timezone).valueOf(),
          videoUrl: row[11],
        }

        await this.sessionController.createSession(session)
      } catch (e) {
        console.error(`Error creating session:`, e)
      }
    }
  }
}
