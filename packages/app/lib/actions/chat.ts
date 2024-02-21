'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { IChat } from 'streameth-new-server/src/interfaces/chat.interface'
import { createChat } from '../services/chatService'

export const createChatAction = async ({ chat }: { chat: IChat }) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await createChat({
    chat,
    authToken,
  })

  if (!response) {
    throw new Error('Error creating stage')
  }
  //   revalidatePath('/')
  return response
}
