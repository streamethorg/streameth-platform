import { apiUrl } from '../utils/utils';

export const videoUpload = async ({
  data,
  headers = {}
}: {
  data: FormData;
  headers?: Record<string, string>;
}): Promise<string> => {
  const uploadUrl = `${apiUrl()}/upload`;
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        ...headers,
      },
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Error uploading video: ${errorText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (e) {
    console.error('❌ Upload error:', e instanceof Error ? e.message : 'Unknown error');
    throw e;
  }
};
