import BaseImporter from '../baseImporter'
import { IDataImporter } from '../../model/event'
import Event from '../../model/event'
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
    let request = await fetch(`${this.apiUrl}/speakers/`)
    if (!request.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await request.json()
    let speakers = data.results

    while (data.next) {
      request = await fetch(data.next)
      if (!request.ok) {
        throw new Error('Network response was not ok')
      }
      data = await request.json()
      speakers = [...speakers, ...data.results]
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
    let request = await fetch(`${this.apiUrl}/rooms/`)
    if (!request.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await request.json()
    let stages = data.results

    while (data.next) {
      request = await fetch(data.next, { method: 'GET' })
      if (!request.ok) {
        throw new Error('Network response was not ok')
      }
      data = await request.json()
      stages = [...stages, ...data.results]
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
    await Promise.all([this.generateStages(), this.generateSpeakers()])

    let request = await fetch(`${this.apiUrl}/talks/`)
    if (!request.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await request.json()
    let sessions = data.results

    while (data.next) {
      request = await fetch(data.next)
      if (!request.ok) {
        throw new Error('Network response was not ok')
      }
      data = await request.json()
      sessions = [...sessions, ...data.results]
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
