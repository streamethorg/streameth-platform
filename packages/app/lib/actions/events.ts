'use server'
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/lib/services/eventService'
import { cookies } from 'next/headers'
import { IExtendedEvent } from '../types'
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface'
import { revalidatePath } from 'next/cache'

export const createEventAction = async ({
  event,
}: {
  event: IEvent
}) => {
  // create scheduelling sheet, and create folder strucutre in drive

  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await createEvent({
    event: { ...event, unlisted: true },
    authToken,
  })

  if (!response) {
    throw new Error('Error creating event')
  }
  revalidatePath('/studio')
  return response
}

export const updateEventAction = async ({
  event,
}: {
  event: IExtendedEvent
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await updateEvent({
    event: { ...event },
    authToken,
  })

  if (!response) {
    throw new Error('Error updating event')
  }
  revalidatePath('/studio')
  return response
}

export const deleteEventAction = async ({
  eventId,
  organizationId,
}: {
  eventId: string
  organizationId: string
}) => {
  const authToken = cookies().get('user-session')?.value

  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await deleteEvent({
    eventId,
    organizationId,
    authToken,
  })
  if (!response) {
    throw new Error('Error deleting event')
  }
  revalidatePath('/studio')
  return response
}
