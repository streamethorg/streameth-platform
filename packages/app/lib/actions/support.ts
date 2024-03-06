'use server'
import { cookies } from 'next/headers'
import { createSupportTicket } from '../services/supportService'

export const createSupportTicketAction = async ({
  message,
}: {
  message: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await createSupportTicket({
    message,
    authToken,
  })

  if (!response) {
    throw new Error('Error creating support ticket')
  }

  return response
}
