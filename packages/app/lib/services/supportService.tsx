import { apiUrl } from '../utils/utils';
import { ISupport } from 'streameth-new-server/src/interfaces/support.interface';
import { fetchClient } from './fetch-client';

export async function createSupportTicket({
  message,
  telegram,
  email,
  image,
}: {
  message: string;
  telegram?: string;
  email?: string;
  image?: string;
}): Promise<ISupport> {
  const response = await fetchClient(`${apiUrl()}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, telegram, email, image }),
  });
  if (!response.ok) {
    throw 'Error creating ticket';
  }
  return (await response.json()).data;
}
