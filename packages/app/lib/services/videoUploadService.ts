import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export const videoUpload = async ({
  data,
}: {
  data: FormData;
}): Promise<string> => {
  try {
    console.log('🎥 Starting video upload to:', `${apiUrl()}/upload`);
    const response = await fetchClient(`${apiUrl()}/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {},
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Video upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Error uploading video: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Video upload successful:', result);
    return result.data;
  } catch (e) {
    console.error('❌ Error in upload video service:', e);
    throw e;
  }
};
