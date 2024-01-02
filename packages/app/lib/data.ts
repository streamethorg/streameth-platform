import { IEvent } from 'streameth-server/model/event'
import { IStage } from 'streameth-server/model/stage'
import { ISession } from 'streameth-server/model/session'
import { ISpeaker } from 'streameth-server/model/speaker'
import EventController from 'streameth-server/controller/event'
import StageController from 'streameth-server/controller/stage'
import SessionController from 'streameth-server/controller/session'
import SpeakerController from 'streameth-server/controller/speaker'
import { NavBarProps } from './types'
export async function fetchEvents(): Promise<IEvent[]> {
  try {
    const eventController = new EventController()
    const data = await eventController.getAllEvents({})
    return data.map((event) => event.toJson())
  } catch (e) {
    console.log(e)
    throw 'Error fetching events'
  }
}

export async function fetchEvent({
  event,
  organization,
}: {
  event: string
  organization: string
}): Promise<IEvent> {
  try {
    const eventController = new EventController()
    const data = await eventController.getEvent(event, organization)
    if (!data) {
      throw 'Event not found'
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

export async function fetchEventSpeakers({
  event,
}: {
  event: string
}): Promise<ISpeaker[]> {
  try {
    const speakerController = new SpeakerController()
    const data = await speakerController.getAllSpeakersForEvent(event)
    return data.map((speaker) => speaker.toJson())
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}

export async function fetchNavBarRoutes({
  event,
  organization,
}: {
  event: string
  organization: string
}): Promise<NavBarProps> {
  const [eventData, sessionData, speakerData, stageData] =
    await Promise.all([
      fetchEvent({ event, organization }),
      fetchEventSessions({ event }),
      fetchEventSpeakers({ event }),
      fetchEventStages({ event }),
    ])

  if (!eventData) {
    throw 'Event not found'
  }

  const pages = []

  if (sessionData.length > 0 && !eventData?.plugins?.hideSchedule)
    pages.push({
      href: `/${organization}/${event}#schedule`,
      name: 'Schedule',
    })

  if (speakerData.length > 0)
    pages.push({
      href: `/${organization}/${event}#speakers`,
      name: 'Speakers',
    })

  for (const stage of stageData) {
    if (stage.streamSettings.streamId) {
      pages.push({
        href: `/${organization}/${event}/stage/${stage.id}`,
        name: stage.name,
      })
    }
  }

  return {
    pages,
    logo: '/events/' + eventData?.logo ?? '',
    homePath: `/${organization}/${event}`,
    showNav: true,
  }
}
