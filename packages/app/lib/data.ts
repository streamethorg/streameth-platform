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
}: {
  eventId?: string
  eventSlug?: string
  organization?: string
}): Promise<IEventModel | null> {
  try {
    if (!eventId && !eventSlug) {
      return null
    }

    const data = await fetch(
      `${apiUrl()}/events/${eventId ?? eventSlug}`,
      {
        cache: 'no-store',
      }
    )

    if (!data.ok) {
      return null
    }
    return (await data.json()).data
  } catch (e) {
    console.log('error in fetchEvent', e)
    throw e
  }
}

export async function fetchEventStages({
  eventId,
}: {
  eventId?: string
}): Promise<IStageModel[]> {
  try {
    console.log(`${apiUrl()}/stages/event/${eventId}`)
    const response = await fetch(
      `${apiUrl()}/stages/event/${eventId}`,
      {
        cache: 'no-store',
      }
    )

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
  stage?: string
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
interface ApiParams {
  event?: string
  organization?: string
  page?: number
  size?: number
  onlyVideos?: boolean
  speakerIds?: string[] // Assuming speakerIds is an array of strings
  date?: Date
}

function constructApiUrl(baseUrl: string, params: ApiParams): string {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value)
        ? value.join(',')
        : value
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        formattedValue
      )}`
    })
    .join('&')
  return `${baseUrl}?${queryParams}`
}

// samuel
export async function fetchAllSessions({
  event,
  organizationSlug,
  date,
  speakerIds,
  onlyVideos,
  page = 1,
  limit,
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
  const params: ApiParams = {
    event,
    organization: organizationSlug,
    page,
    size: searchQuery ? 0 : limit,
    onlyVideos,
    speakerIds,
    date,
  }
  const response = await fetch(
    constructApiUrl(`${apiUrl()}/sessions`, params)
  )
  const allSessions = (await response.json()).data

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase()

    const fuzzySearch = new FuzzySearch(
      allSessions?.sessions,
      ['name', 'description', 'speakers.name'],
      {
        caseSensitive: false,
        sort: true,
      }
    )

    allSessions.sessions = fuzzySearch.search(normalizedQuery)
  }

  // Calculate total items and total pages
  const totalItems = searchQuery
    ? allSessions.sessions.length
    : allSessions.totalDocuments
  const totalPages = limit ? Math.ceil(totalItems / limit) : 1

  // Implement manual pagination for fuzzy search
  const startIndex = (page - 1) * limit!
  const endIndex = startIndex + limit!
  const paginatedSessions = allSessions.sessions.slice(
    startIndex,
    endIndex
  )

  // Return paginated data and pagination metadata
  return {
    sessions: searchQuery ? paginatedSessions : allSessions.sessions,
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
export async function fetchSessions({
  event,
  stage,
  date,
  onlyVideos = false,
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
      fetchEvent({ eventSlug: event }),
      fetchSessions({ event }),
      fetchEventSpeakers({ event }),
      fetchEventStages({ eventId: event }),
    ])

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
export const fetchSession = async ({
  session,
}: {
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
