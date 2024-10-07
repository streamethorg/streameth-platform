'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { IChat } from 'streameth-new-server/src/interfaces/chat.interface';
import { createChat } from '../services/chatService';

export const createChatAction = async ({ chat }: { chat: IChat }) => {
  const response = await createChat({
    chat,
  });

  if (!response) {
    throw new Error('Error creating stage');
  }
  //   revalidatePath('/')
  return response;
};
