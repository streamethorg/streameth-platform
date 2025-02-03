import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export const imageUpload = async ({
  data,
}: {
  data: FormData;
}): Promise<string> => {
  try {
    console.log('📤 Starting image upload:', {
      fileName: (data.get('file') as File)?.name,
      fileSize: `${((data.get('file') as File)?.size || 0) / 1024 / 1024}MB`,
      directory: data.get('directory'),
    });

    const response = await fetchClient(`${apiUrl()}/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {},
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Image upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Error uploading image: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Image upload successful:', {
      url: result.data,
    });
    return result.data;
  } catch (e) {
    console.error('❌ Error in image upload service:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
    });
    throw e;
  }
};
