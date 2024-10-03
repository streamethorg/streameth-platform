'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const session = await auth();
  const headers = new Headers(options.headers);

  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
