"use server"
import { createEvent } from '@/lib/services/eventService'
import { cookies } from 'next/headers'
import { IEvent } from "streameth-new-server/src/interfaces/event.interface"


export const createEventAction = async ({
  event,
}: {
  event: IEvent
}) => {
  console.log('event', event)
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await createEvent({
    event,
    authToken,
  })

  if (!response) {
    console.log(response)
    throw new Error('Error creating event')
  }

  return response
}