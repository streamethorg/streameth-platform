import BaseImporter from '../baseImporter'
import { IDataImporter } from '../../model/event'
import Event from '../../model/event'
import axios from 'axios'
import Speaker from '../../model/speaker'
import { generateId } from '../../utils'
import moment from 'moment-timezone'
export default class PretalxImporter extends BaseImporter {
  apiUrl: string

  constructor({ importer, event }: { importer: IDataImporter; event: Event }) {
    super(event)
    if (importer.type !== 'pretalx') throw new Error('Invalid importer type for gsheet module')
    if (!importer.config.url) throw new Error('No valid sheetId set for gsheet module')
    this.apiUrl = importer.config.url
  }

  async generateSpeakers(): Promise<void> {
    let request = await axios.get(`${this.apiUrl}/speakers/`)
    let speakers = request.data.results
    while (request.data.next) {
      request = await axios.get(request.data.next)
      speakers = [...speakers, ...request.data.results]
    }
    speakers.forEach(async (speaker: any) => {
      const newSpeaker = {
        name: speaker.name,
        bio: speaker.biography,
        photo: speaker.avatar,
        twitter: speaker.twitter_handle,
        github: speaker.github_handle,
        website: speaker.website,
        eventId: this.event.id,
      }

      try {
        if (speaker) {
          await this.speakerController.createSpeaker(newSpeaker)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  async generateStages(): Promise<void> {
    // fetch https://speak.protocol.berlin/api/events/protocol-berg/stages/
    let request = await axios.get(`${this.apiUrl}/rooms/`)
    let stages = request.data.results
    while (request.data.next) {
      request = await axios.get(request.data.next)
      stages = [...stages, ...request.data.results]
    }
    stages.forEach(async (stage: any) => {
      const newStage = {
        name: stage.name.en,
        eventId: this.event.id,
        streamSettings: {
          streamId: '',
        },
        order: stage.position + 1,
      }

      try {
        if (stage) {
          await this.stageController.createStage(newStage)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  async generateSessions(): Promise<void> {
    // fetch https://speak.protocol.berlin/api/events/protocol-berg/talks/
    await Promise.all([this.generateStages(), this.generateSpeakers()])
    let request = await axios.get(`${this.apiUrl}/talks/`)
    let sessions = request.data.results
    while (request.data.next) {
      request = await axios.get(request.data.next)
      sessions = [...sessions, ...request.data.results]
    }

    sessions.forEach(async (session: any) => {
      const speakers = session.speakers.map(async (speaker: any) => {
        return await this.speakerController.getSpeaker(generateId(speaker.name), this.event.id)
      })
      const newSession = {
        name: session.title,
        description: session.abstract,
        start: moment.tz(new Date(session.slot.start), this.event.timezone).valueOf(),
        end: moment.tz(new Date(session.slot.end), this.event.timezone).valueOf(),
        eventId: this.event.id,
        speakers: await Promise.all(speakers),
        stageId: generateId(session.slot.room.en),
      }

      try {
        if (session) {
          await this.sessionController.createSession(newSession)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
}
