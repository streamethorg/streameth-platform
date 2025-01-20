import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export const videoUpload = async ({
  data,
}: {
  data: FormData;
}): Promise<string> => {
  try {
    const uploadUrl = `${apiUrl()}/upload`;
    console.log('🎥 Starting video upload service call:', {
      url: uploadUrl,
      fileSize: (data.get('file') as File)?.size,
      directory: data.get('directory'),
    });

    console.log('🔑 Checking auth headers...');
    const response = await fetchClient(uploadUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {},
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Video upload service failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(`Error uploading video: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Video upload service successful:', {
      result,
      responseHeaders: Object.fromEntries(response.headers.entries()),
    });
    return result.data;
  } catch (e) {
    console.error('💥 Error in video upload service:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
    });
    throw e;
  }
};
