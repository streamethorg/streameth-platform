'use server';

import { fetchUserData } from '../services/userService';

export const fetchUserAction = async () => {
  return await fetchUserData();
};
