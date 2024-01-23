import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'

import { NavBarProps, IPagination } from './types'
import FuzzySearch from 'fuzzy-search'
import { apiUrl } from '@/lib/utils/utils'

export async function fetchOrganization({
  organizationSlug,
  organizationId,
}: {
  organizationSlug?: string
  organizationId?: string
}): Promise<IOrganizationModel | null> {
  try {
    if (!organizationSlug && !organizationId) {
      return null
    }
    const response = await fetch(
      `${apiUrl()}/organizations/${
        organizationId ? organizationId : organizationSlug
      }`,
      {
        cache: 'no-store',
      }
    )
    const data = (await response.json()).data

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function fetchOrganizations(): Promise<
  IOrganizationModel[]
> {
  try {
    const response = await fetch(`${apiUrl()}/organizations`, {
      cache: 'no-store',
    })
    return (await response.json()).data ?? []
  } catch (e) {
    console.log(e)
    throw 'Error fetching organizations'
  }
}

export async function fetchEvents({
  organizationId,
  organizationSlug,
  date,
}: {
  organizationId?: string
  organizationSlug?: string
  date?: Date
}): Promise<IEventModel[]> {
  try {
    let data: IEventModel[] = []

    if (organizationId || organizationSlug) {
      console.log('fetching events for organization')
      const organization = await fetchOrganization({
        organizationId,
        organizationSlug,
      })
      if (!organization) {
        return []
      }
      const response = await fetch(
        `${apiUrl()}/events/organization/${organization._id}`
      )
      data = (await response.json()).data ?? []
    } else {
      const response = await fetch(`${apiUrl()}/events`)
      data = (await response.json()).data ?? []
    }

    if (date) {
      data = data.filter(
        (event) =>
          new Date(event.start).getTime() <= date.getTime() &&
          new Date(event.end).getTime() >= date.getTime()
      )
    }

    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching events' + e
  }
}

export async function fetchEvent({
  eventId,
  eventSlug,
  organization,
}: {
  eventId?: string
  eventSlug?: string
  organization?: string
}): Promise<IEventModel> {
  try {
    const data = await fetch(
      `${apiUrl()}/events/${eventId ?? eventSlug}`
    )
    return (await data.json()).data
  } catch (e) {
    console.log(e)
    throw 'Error fetching event'
  }
}

export async function fetchEventStages({
  eventId,
}: {
  event: string
}): Promise<IStageModel[]> {
  try {
    const response = await fetch(`${apiUrl()}/stages/event/${event}`)

    const data = (await response.json()).data
    return data.map((stage: IStageModel) => stage)
  } catch (e) {
    console.log(e)
    throw 'Error fetching stages'
  }
}

export async function fetchEventStage({
  stage,
}: {
  stage: string
}): Promise<IStageModel> {
  try {
    const response = await fetch(`${apiUrl()}/stages/${stage}`)
    const data = (await response.json()).data
    if (!data) {
      throw 'Stage not found'
    }
    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching stage'
  }
}

// samuel
export async function fetchAllSessions({
  organizationSlug,
  event,
  date,
  speakerIds,
  onlyVideos,
  page = 1,
  limit = 10,
  searchQuery = '',
}: {
  event?: string
  organizationSlug?: string
  date?: Date
  speakerIds?: string[]
  onlyVideos?: boolean
  page?: number
  limit?: number
  searchQuery?: string
}): Promise<{ sessions: ISessionModel[]; pagination: IPagination }> {
  let allSessions

  if (event) {
    // existing logic to fetch all sessions for a specific event
    allSessions = await fetchEventSessions({
      event,
      date,
      speakerIds,
      onlyVideos,
      page,
      limit,
    })
  } else {
    // existing logic to fetch all sessions across all organizations
    const response = await fetch(
      `${apiUrl()}/sessions?organization=${organizationSlug}&page=${page}&size=${limit}&onlyVideos=${onlyVideos}&speakerIds=${speakerIds}`
    )
    allSessions = (await response.json()).data
  }

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase()

    const fuzzySearch = new FuzzySearch(
      allSessions?.sessions,
      ['event'],
      {
        caseSensitive: false,
      }
    )

    allSessions.sessions = fuzzySearch.search(normalizedQuery)
  }

  // Calculate total items and total pages
  const totalItems = allSessions.totalDocuments
  const totalPages = Math.ceil(totalItems / limit)

  // Return paginated data and pagination metadata
  return {
    sessions: allSessions.sessions,
    pagination: allSessions?.pagination
      ? allSessions.pagination
      : {
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
  date,
  onlyVideos,
  page = 0,
  limit = 0,
}: {
  event?: string
  stage?: string
  timestamp?: number
  date?: Date
  speakerIds?: string[]
  onlyVideos?: boolean
  page?: number
  limit?: number
}): Promise<{ sessions: ISessionModel[]; pagination: IPagination }> {
  try {
    const response = await fetch(
      `${apiUrl()}/sessions?event=${event}&page=${page}&size=${limit}&onlyVideos=${onlyVideos}&stage=${stage}&date=${date}`
    )

    let eventSessions = (await response.json()).data

    return {
      sessions: eventSessions.sessions.map(
        (session: ISessionModel) => session
      ),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(eventSessions.totalDocuments / limit),
        totalItems: eventSessions.totalDocuments,
        limit,
      },
    }
  } catch (e) {
    console.log(e)
    throw 'Error fetching event sessions'
  }
}

// samuel
export async function fetchEventSpeakers({
  event,
}: {
  event?: string
}): Promise<ISpeakerModel[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/speakers/event/${event}`
    )
    const data = (await response.json()).data

    return data.map((speaker: ISpeakerModel) => speaker)
  } catch (e) {
    console.log(e)
    throw 'Error fetching event speakers'
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
      fetchEvent({ event }),
      fetchEventSessions({ event }),
      fetchEventSpeakers({ event }),
      fetchEventStages({ event }),
    ])

  if (!eventData) {
    throw 'Event not found'
  }

  const pages = []

  if (
    sessionData.sessions.length > 0 &&
    !eventData?.plugins?.hideSchedule
  )
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
        href: `/${organization}/${event}/stage/${stage._id}`,
        name: stage.name,
      })
    }
  }

  return {
    pages,
    logo: eventData?.logo ?? '',
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
}): Promise<ISessionModel | null> => {
  try {
    const response = await fetch(`${apiUrl()}/sessions/${session}`)
    if (!response.ok) {
      return null
    }
    return (await response.json()).data
  } catch (e) {
    console.log(e)
    throw 'Error fetching event session'
  }
}
