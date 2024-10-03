import { apiUrl } from '../utils/utils';
import { IExtendedUser } from '../types';

export async function fetchUser({
  authToken,
}: {
  userId?: string;
  authToken?: string;
}): Promise<IExtendedUser | null> {
  try {
    const data = await fetch(`${apiUrl()}/auth/token`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return (await data.json()).data;
  } catch (e) {
    console.log('error in fetchUser', e);
    throw e;
  }
}

export async function fetchUserData({
  authToken,
}: {
  userId?: string;
  authToken?: string;
}): Promise<IExtendedUser | null> {
  try {
    const user = await fetchUser({ authToken });
    const data = await fetch(`${apiUrl()}/users/${user?.email}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!data.ok) {
      return null;
    }
    return (await data.json()).data;
  } catch (e) {
    console.log('error in fetchUser', e);
    throw e;
  }
}
