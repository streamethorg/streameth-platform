import { IEvent } from '@/lib/types'
import { ISession } from 'streameth-server/model/session'

export function extractSearchParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  keys: (keyof T)[]
): T {
  const params: Partial<T> = {}
  for (const key of keys) {
    const value = searchParams.get(key as string)
    if (value !== null) {
      params[key] = value as any // Use a type assertion here
    } else {
      params[key] = undefined as any // And here
    }
  }
  return params as T
}

export const getSessions = async ({
  event,
  timestamp,
  stage,
  date,
}: {
  event: IEvent
  timestamp?: number
  stage?: string
  date?: number
}) => {
  const baseUrl = `/api/organizations/${event.organizationId}/events/${event.id}/sessions`
  const params = new URLSearchParams()

  if (timestamp) {
    params.set('timestamp', timestamp.toString())
  }
  if (stage) {
    params.set('stage', stage)
  }
  if (date) {
    params.set('date', date.toString())
  }

  const url = `${baseUrl}?${params.toString()}`
  const response = await fetch(url, {
    cache: 'no-cache',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch schedule')
  }

  const schedule: ISession[] = await response.json()
  return schedule
}
