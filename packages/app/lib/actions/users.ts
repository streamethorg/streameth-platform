'use server';

import { cookies } from 'next/headers';
import { fetchUserData } from '../services/userService';

export const fetchUserAction = async ({ userId }: { userId?: string }) => {
  const authToken = cookies().get('user-session')?.value;
  const userAddress = cookies().get('user-address')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  const response = await fetchUserData({
    userId: userId ?? userAddress,
    authToken,
  });

  if (!response) {
    throw new Error('Error fetching user data');
  }
  return response;
};
