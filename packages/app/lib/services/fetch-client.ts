'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const session = await auth();
  const headers = new Headers(options.headers);

  if (session?.accessToken) {
    console.log('🔑 Adding auth token to request');
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  } else {
    console.warn('⚠️ No auth token available for request');
  }

  console.log('🌐 Making request to:', url);
  return fetch(url, {
    ...options,
    headers,
  });
};
