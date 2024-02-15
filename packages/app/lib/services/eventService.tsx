import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'
import {
  IEvent,
  IEventModel,
} from 'streameth-new-server/src/interfaces/event.interface'
import { fetchOrganization } from './organizationService'
import { IExtendedEvent } from '../types'

export async function fetchEvents({
  organizationId,
  organizationSlug,
  date,
}: {
  organizationId?: string
  organizationSlug?: string
  date?: Date
}): Promise<IExtendedEvent[]> {
  try {
    let data: IExtendedEvent[] = []

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
}): Promise<IExtendedEvent | null> {
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

export const createEvent = async ({
  event,
  authToken,
}: {
  event: IEvent
  authToken: string
}): Promise<IEventModel> => {
  try {
    const response = await fetch(`${apiUrl()}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(event),
    })
    if (!response.ok) {
      throw 'Error creating event'
    }
    return (await response.json()).data
  } catch (e) {
    console.log('error in createEvent', e)
    throw e
  }
}

export const updateEvent = async ({
  event,
  authToken,
}: {
  event: IExtendedEvent
  authToken: string
}): Promise<IEventModel> => {
  const modifiedObject = (({ _id, ...rest }) => rest)(event)
  try {
    const response = await fetch(`${apiUrl()}/events/${event._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(modifiedObject),
    })
    if (!response.ok) {
      throw 'Error updating event'
    }
    return (await response.json()).data
  } catch (e) {
    console.log('error in updateEvent', e)
    throw e
  }
}
export const deleteEvent = async ({
  eventId,
  organizationId,
  authToken,
}: {
  eventId: string
  organizationId: string
  authToken: string
}): Promise<IEventModel> => {
  try {
    const response = await fetch(`${apiUrl()}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ organizationId }),
    })
    if (!response.ok) {
      throw 'Error deleting event'
    }

    return await response.json()
  } catch (e) {
    console.log('error in deleteEvent', e)
    throw e
  }
}
