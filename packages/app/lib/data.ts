import { IOrganization } from 'streameth-server/model/organization'
import Event from 'streameth-new-server/src/models/event.model'
import Session  from 'streameth-new-server/src/models/session.model'
import Speaker  from 'streameth-new-server/src/models/speaker.model'
import Stage  from 'streameth-new-server/src/models/stage.model'
import Organization  from 'streameth-new-server/src/models/organization.model'

import EventController from 'streameth-server/controller/event'
import StageController from 'streameth-server/controller/stage'
import SessionController from 'streameth-server/controller/session'
import SpeakerController from 'streameth-server/controller/speaker'
import { NavBarProps, IPagination } from './types'
import FuzzySearch from 'fuzzy-search'
import { apiUrl } from '@/lib/utils/utils'

export async function fetchOrganization({
  organizationSlug,
  organizationId,
}: {
  organizationSlug?: string
  organizationId?: string
}): Promise<IOrganization | null> {
  try {
    if (!organizationSlug && !organizationId) {
      return null
    }
    const response = await fetch(
      `${apiUrl()}/organizations/${organizationId ? organizationId : organizationSlug}`
    )
    return (await response.json()).data
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function fetchOrganizations(): Promise<IOrganization[]> {
  try {
    const response = await fetch(`${apiUrl()}/organizations`)
    return (await response.json()).data ?? []
  } catch (e) {
    console.log(e)
    throw 'Error fetching organizations'
  }
}

export async function fetchEvents({
  organizationId,
  date,
}: {
  organizationId?: string
  date?: Date
}): Promise<Event[]> {
  try {
    const response = await fetch(`${apiUrl()}/events`)
    const data: Event[] = (await response.json()).data ?? []
    if (organizationId) {
      return data.filter((event) => {
        if (event.organizationId === organizationId) {
          if (date) {
            return (
              // TODO: Fix this
              // event.start >= date.getTime()
              false
            )
          } else {
            return true
          }
        }
      })
    }

    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching events' + e
  }
}

export async function fetchEvent({
  event,
  organization,
}: {
  event: string
  organization?: string
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

export async function fetchEventStage({
  event,
  stage,
}: {
  event: string
  stage: string
}): Promise<IStage> {
  try {
    const stageController = new StageController()
    const data = await stageController.getStage(stage, event)
    if (!data) {
      throw 'Stage not found'
    }
    return data.toJson()
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}


// samuel
export async function fetchAllSessions({
  organization,
  event,
  date,
  speakerIds,
  onlyVideos,
  page = 1,
  limit = 10,
  searchQuery = '',
}: {
  event?: string
  organization?: string
  date?: Date
  speakerIds?: string[]
  onlyVideos?: boolean
  page?: number
  limit?: number
  searchQuery?: string
}): Promise<{ sessions: ISession[]; pagination: IPagination }> {
  let allSessions: ISession[] = []

    // const response = await fetch(
  //   `${apiUrl()}/sessions?organization=${organization?.slug}&onlyVideos=true&page=1&size=4`
  // )
  // const data = await response.json()
  // const videos = data.data.sessions ?? []
  // Fetch all data


  if (event) {
    // existing logic to fetch all sessions for a specific event
    allSessions = await fetchEventSessions({
      event,
      date,
      speakerIds,
      onlyVideos,
    })
  } else {
    // existing logic to fetch all sessions across all organizations
    const organizations = organization
      ? [organization]
      : (await fetchOrganizations()).map((org) => org.id)

    for (const org of organizations) {
      const events = await fetchEvents({ organizationId: org, date })
      for (const ev of events) {
        const sessions = await fetchEventSessions({
          event: ev.id,
          date,
          speakerIds,
          onlyVideos,
        })
        allSessions = allSessions.concat(sessions)
      }
    }
  }

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase()
    console.log(allSessions[0])
    const fuzzySearch = new FuzzySearch(allSessions, ['eventId'], {
      caseSensitive: false,
    })

    allSessions = fuzzySearch.search(normalizedQuery)
  }

  // Calculate total items and total pages
  const totalItems = allSessions.length
  const totalPages = Math.ceil(totalItems / limit)

  // Implement manual pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedSessions = allSessions.slice(startIndex, endIndex)

  // Return paginated data and pagination metadata
  return {
    sessions: paginatedSessions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  }
}

// samuel
export async function fetchEventSessions({
  event,
  stage,
  timestamp,
  date,
  speakerIds,
  onlyVideos,
}: {
  event: string
  stage?: string
  timestamp?: number
  date?: Date
  speakerIds?: string[]
  onlyVideos?: boolean
}): Promise<ISession[]> {
  try {
    const sessionController = new SessionController()
    let data = await sessionController.getAllSessions({
      eventId: event,
      stage,
      timestamp,
      date,
      speakerIds,
      onlyVideos,
    })

    return data.map((session) => session.toJson())
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}

// samuel
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

// samuel
export const fetchEventSession = async ({
  event,
  session,
}: {
  event: string
  session: string
}): Promise<ISession | null> => {
  try {
    const sessionController = new SessionController()
    const data = await sessionController.getSession(session, event)
    if (!data) {
      return null
    }
    return data.toJson()
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}
