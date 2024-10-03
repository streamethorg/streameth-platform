import { apiUrl } from '../utils/utils';
import { IExtendedUser } from '../types';
import { fetchClient } from './fetch-client';

export async function fetchUser(): Promise<IExtendedUser | null> {
  try {
    const data = await fetchClient(`${apiUrl()}/auth/token`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return (await data.json()).data;
  } catch (e) {
    console.log('error in fetchUser', e);
    throw e;
  }
}

export async function fetchUserData(): Promise<IExtendedUser | null> {
  try {
    const user = await fetchUser();
    const data = await fetchClient(`${apiUrl()}/users/${user?.email}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
