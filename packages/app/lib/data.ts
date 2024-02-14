import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'

import { NavBarProps, IPagination, IExtendedSession } from './types'
import FuzzySearch from 'fuzzy-search'
import { apiUrl } from '@/lib/utils/utils'

import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'

interface ApiParams {
  event?: string
  organization?: string
  stageId?: string
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

export async function fetchAllSessions({
  event,
  organizationSlug,
  stageId,
  speakerIds,
  onlyVideos,
  page = 1,
  limit,
  searchQuery = '',
}: {
  event?: string
  organizationSlug?: string
  stageId?: string
  speakerIds?: string[]
  onlyVideos?: boolean
  page?: number
  limit?: number
  searchQuery?: string
}): Promise<{
  sessions: IExtendedSession[]
  pagination: IPagination
}> {
  const params: ApiParams = {
    event,
    stageId,
    organization: organizationSlug,
    page,
    size: searchQuery ? 0 : limit,
    onlyVideos,
    speakerIds,
  }
  const response = await fetch(
    constructApiUrl(`${apiUrl()}/sessions`, params), 
    {
      cache: 'no-store',
    }
  )
  const a = await response.json()
  const allSessions = a.data
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
      fetchAllSessions({ event }),
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
