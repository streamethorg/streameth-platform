import BaseController from './baseController'
import Session, { ISession } from '../model/session'
import { getEnvironment } from '../utils'

export default class SessionController {
  private controller: BaseController<ISession>

  constructor() {
    this.controller = new BaseController<ISession>(getEnvironment())
  }

  public async getSession(
    sessionId: ISession['id'],
    eventId: ISession['eventId']
  ): Promise<Session> {
    const sessionQuery = await Session.getSessionPath(
      eventId,
      sessionId
    )
    const data = await this.controller.get(sessionQuery)
    return new Session({ ...data })
  }

  public async createSession(
    session: Omit<ISession, 'id'>
  ): Promise<Session> {
    const ses = new Session({ ...session })
    const sessionQuery = await Session.getSessionPath(
      ses.eventId,
      ses.id
    )
    await this.controller.create(sessionQuery, ses)
    return ses
  }

  public async getAllSessions({
    eventId,
    stage,
    timestamp,
    date,
    speakerIds,
  }: {
    eventId: ISession['eventId']
    stage?: ISession['stageId']
    timestamp?: number
    date?: number
    speakerIds?: string[]
  }): Promise<Session[]> {
    const sessions: Session[] = []
    const sessionQuery = await Session.getSessionPath(eventId)
    let data = await this.controller.getAll(sessionQuery)
    if (stage) {
      data = data.filter((session) => session.stageId === stage)
    }
    if (timestamp) {
      data = data.filter(
        (session) => new Date(session.end).getTime() >= timestamp
      )
    }
    if (date) {
      const filterDate = new Date(date)
      data = data.filter((session) => {
        const sessionDate = new Date(session.start)
        return (
          sessionDate.getFullYear() === filterDate.getFullYear() &&
          sessionDate.getMonth() === filterDate.getMonth() &&
          sessionDate.getDate() === filterDate.getDate()
        )
      })
    }

    if (speakerIds) {
      data = data.filter((session) => {
        return session.speakers.some((speaker) =>
          speakerIds.includes(speaker.id)
        )
      })
    }

    // sort by start date
    data.sort(
      (a, b) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    )

    for (const ses of data) {
      sessions.push(new Session({ ...ses }))
    }
    return sessions
  }
}
