import { apiUrl } from '../utils/utils';
import { ISupport } from 'streameth-new-server/src/interfaces/support.interface';

export async function createSupportTicket({
  message,
  telegram,
  email,
  image,
  authToken,
}: {
  message: string;
  telegram?: string;
  email?: string;
  image?: string;
  authToken: string;
}): Promise<ISupport> {
  const response = await fetch(`${apiUrl()}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ message, telegram, email, image }),
  });
  if (!response.ok) {
    throw 'Error creating ticket';
  }
  return (await response.json()).data;
}
