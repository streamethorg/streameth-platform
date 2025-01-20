'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  try {
    console.log('🌐 Fetch client starting request to:', url);
    const session = await auth();
    const headers = new Headers(options.headers);

    if (session?.accessToken) {
      console.log('🔐 Adding auth token to request');
      headers.set('Authorization', `Bearer ${session.accessToken}`);
    } else {
      console.warn('⚠️ No auth token available for request');
    }

    console.log('📡 Making request with headers:', {
      method: options.method,
      headers: Object.fromEntries(headers.entries()),
      hasBody: !!options.body,
      bodyType: options.body instanceof FormData ? 'FormData' : typeof options.body,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 Received response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (e) {
    console.error('💥 Error in fetch client:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      url,
      method: options.method,
    });
    throw e;
  }
};
