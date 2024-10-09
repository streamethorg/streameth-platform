'use server';

import { fetchUserData } from '../services/userService';

export const fetchUserAction = async () => {
  const response = await fetchUserData();

  if (!response) {
    throw new Error('Error fetching user data');
  }
  return response;
};
