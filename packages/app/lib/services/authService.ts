import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export async function emailSignIn({
  email,
}: {
  email: string;
}): Promise<string> {
  const response = await fetchClient(`${apiUrl()}/auth/email-signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    throw 'Error creating stage';
  }
  return (await response.json()).data;
}
