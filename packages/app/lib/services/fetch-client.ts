'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  try {
    console.log('🌐 Fetch client starting request:', {
      url,
      method: options.method || 'GET',
      hasBody: !!options.body,
      bodyType: options.body instanceof FormData ? 'FormData' : typeof options.body,
      timestamp: new Date().toISOString()
    });

    const session = await auth();
    const headers = new Headers(options.headers);

    if (session?.accessToken) {
      console.log('🔐 Adding auth token to request');
      headers.set('Authorization', `Bearer ${session.accessToken}`);
    } else {
      console.warn('⚠️ No auth token available for request:', {
        url,
        method: options.method,
        timestamp: new Date().toISOString()
      });
    }

    console.log('📡 Making request with headers:', {
      method: options.method,
      headers: Object.fromEntries(headers.entries()),
      hasBody: !!options.body,
      bodyType: options.body instanceof FormData ? 'FormData' : typeof options.body,
      url,
      timestamp: new Date().toISOString()
    });

    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      headers,
    });
    const endTime = Date.now();

    console.log('📥 Received response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      timeToComplete: `${endTime - startTime}ms`,
      url,
      timestamp: new Date().toISOString()
    });

    if (!response.ok) {
      console.error('❌ Request failed:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url,
        method: options.method,
        timestamp: new Date().toISOString()
      });
    }

    return response;
  } catch (e) {
    console.error('💥 Error in fetch client:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      url,
      method: options.method,
      timestamp: new Date().toISOString()
    });
    throw e;
  }
};
