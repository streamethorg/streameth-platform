'use server'
import { cookies } from 'next/headers'
import { IExtendedSession } from '../types'
import { updateSession } from '../services/sessionService'

export const updateSessionAction = async ({
  session,
}: {
  session: IExtendedSession
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await updateSession({
    session,
    authToken,
  })

  if (!response) {
    throw new Error('Error updating session')
  }
  return response
}
