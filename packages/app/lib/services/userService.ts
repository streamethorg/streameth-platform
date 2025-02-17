import { apiUrl } from '../utils/utils';
import { IExtendedUser } from '../types';
import { fetchClient } from './fetch-client';

export async function fetchUser(): Promise<IExtendedUser | null> {
  try {
    const data = await fetchClient(`${apiUrl()}/auth/token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await data.json();

    return responseData.data;
  } catch (e) {
    console.log('error in fetchUser', e);
    return null;
  }
}

export async function fetchUserData(): Promise<IExtendedUser | null> {
  try {
    const user = await fetchUser();
    if (!user) {
      return null;
    }
    const data = await fetchClient(`${apiUrl()}/users/${user?.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!data.ok) {
      return null;
    }
    return (await data.json()).data;
  } catch (e) {
    console.log('error in fetchUser', e);
    return null;
  }
}
