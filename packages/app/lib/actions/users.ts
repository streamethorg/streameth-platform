'use server';

import { cookies } from 'next/headers';
import { fetchUserData } from '../services/userService';
import { auth } from '@/auth';

export const fetchUserAction = async () => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error('No user session found');
  }
  const response = await fetchUserData({
    authToken: session?.accessToken,
  });

  if (!response) {
    throw new Error('Error fetching user data');
  }
  return response;
};
