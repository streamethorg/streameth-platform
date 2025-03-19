import { apiUrl } from '../utils/utils';
import { IExtendedUser, IExtendedUserWithOrganizations } from '../types';
import { fetchClient } from './fetch-client';

export async function fetchUser(): Promise<IExtendedUser | null> {
  const startTime = Date.now();
  console.log('🔐 [fetchUser] Starting user token fetch...');
  
  try {
    const data = await fetchClient(`${apiUrl()}/auth/token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const responseData = await data.json();
    
    console.log(`⚡ [fetchUser] Token fetch complete in ${Date.now() - startTime}ms`);
    return responseData.data;
  } catch (e) {
    console.error('💥 [fetchUser] Error fetching user token:', e);
    return null;
  }
}


export async function fetchUserData(): Promise<IExtendedUserWithOrganizations | null> {
  const startTime = Date.now();
  console.log('🔍 [fetchUserData] Starting user data fetch...');
  
  try {
    const user = await fetchUser();
    if (!user) {
      console.log('🚫 [fetchUserData] No user token found');
      return null;
    }
    
    console.log(`👤 [fetchUserData] Fetching user details for ${user.email}...`);
    const fetchStartTime = Date.now();
    
    const data = await fetchClient(`${apiUrl()}/users/${user.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!data.ok) {
      console.error(`❌ [fetchUserData] API returned status ${data.status}`);
      return null;
    }
    
    const userData = await data.json();
    console.log(`⏱️ [fetchUserData] User data fetch complete in ${Date.now() - fetchStartTime}ms`);
    console.log(`🎉 [fetchUserData] Total operation took ${Date.now() - startTime}ms`);
    
    return userData.data;
  } catch (e) {
    console.error('💥 [fetchUserData] Error fetching user data:', e);
    return null;
  }
}
