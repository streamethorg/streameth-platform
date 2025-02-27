'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const requestId = Math.random().toString(36).substring(7);
  try {

    const session = await auth();
    // const headers = new Headers(options.headers);

    if (session?.accessToken) {
      console.log(`🔐 [${requestId}] Adding auth token to request`);
      // headers.set('Authorization', `Bearer ${session.accessToken}`);
    } else {
      console.warn(`⚠️ [${requestId}] No auth token available for request:`, {
        url,
        method: options.method,
        timestamp: new Date().toISOString(),
      });
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return response;
  } catch (e) {
    console.error(`💥 [${requestId}] Error in fetch client:`, {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      url,
      method: options.method,
      timestamp: new Date().toISOString(),
    });
    throw e;
  }
};