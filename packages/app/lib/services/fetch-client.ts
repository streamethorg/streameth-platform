'use server';
import { auth } from '@/auth';

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const requestId = Math.random().toString(36).substring(7);
  try {
    console.log(`🌐 [${requestId}] Fetch client starting request:`, {
      url,
      method: options.method || 'GET',
      hasBody: !!options.body,
      bodyType:
        options.body instanceof FormData ? 'FormData' : typeof options.body,
      bodySize:
        options.body instanceof FormData
          ? `${((options.body.get('file') as File)?.size || 0) / 1024 / 1024}MB`
          : undefined,
      timestamp: new Date().toISOString(),
    });

    const session = await auth();
    const headers = new Headers(options.headers);

    if (session?.accessToken) {
      console.log(`🔐 [${requestId}] Adding auth token to request`);
      headers.set('Authorization', `Bearer ${session.accessToken}`);
    } else {
      console.warn(`⚠️ [${requestId}] No auth token available for request:`, {
        url,
        method: options.method,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`📡 [${requestId}] Making request with headers:`, {
      method: options.method,
      headers: Object.fromEntries(headers.entries()),
      hasBody: !!options.body,
      bodyType:
        options.body instanceof FormData ? 'FormData' : typeof options.body,
      url,
      timestamp: new Date().toISOString(),
    });

    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      headers,
    });
    const endTime = Date.now();

    const responseHeaders = Object.fromEntries(response.headers.entries());
    const contentType = responseHeaders['content-type'] || '';

    console.log(`📥 [${requestId}] Received response:`, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      timeToComplete: `${endTime - startTime}ms`,
      contentType,
      url,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      let errorDetails;
      try {
        // Try to parse error response
        if (contentType.includes('application/json')) {
          errorDetails = await response.clone().json();
        } else {
          errorDetails = await response.clone().text();
        }
      } catch (e) {
        errorDetails = 'Could not parse error response';
      }

      console.error(`❌ [${requestId}] Request failed:`, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        error: errorDetails,
        url,
        method: options.method,
        timestamp: new Date().toISOString(),
      });
    }

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
