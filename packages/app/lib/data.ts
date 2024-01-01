import { IEvent } from 'streameth-server/model/event'
import { IStage } from 'streameth-server/model/stage'
import { ISession } from 'streameth-server/model/session'
import EventController from 'streameth-server/controller/event'
import StageController from 'streameth-server/controller/stage'
import SessionController from 'streameth-server/controller/session'

export async function fetchEvent({
  event,
  organization,
}: {
  event: string
  organization: string
}): Promise<IEvent | null> {
  try {
    const eventController = new EventController()
    const data = await eventController.getEvent(event, organization)
    if (!data) {
      return null
    }
    return data.toJson()
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}

export async function fetchEventStages({
  event,
}: {
  event: string
}): Promise<IStage[]> {
  try {
    const stageController = new StageController()
    const data = await stageController.getAllStagesForEvent(event)
    return data.map((stage) => stage.toJson())
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}

export async function fetchEventSessions({
  event,
  stage,
  timestamp,
  date,
  speakerIds,
}: {
  event: string
  stage?: string
  timestamp?: number
  date?: number
  speakerIds?: string[]
}): Promise<ISession[]> {
  try {
    const sessionController = new SessionController()
    const data = await sessionController.getAllSessions({
      eventId: event,
      stage,
      timestamp,
      date,
      speakerIds,
    })
    return data.map((session) => session.toJson())
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}
