import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export async function magicLinkSignIn({
  email,
}: {
  email: string;
}): Promise<string> {
  const response = await fetchClient(`${apiUrl()}/auth/magic-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw 'Error sending magic link';
  }
  return await response.json();
}
