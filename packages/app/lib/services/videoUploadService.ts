import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export const videoUpload = async ({
  data,
}: {
  data: FormData;
}): Promise<string> => {
  const uploadUrl = `${apiUrl()}/upload`;
  
  try {
    console.log('🎥 Starting video upload service call:', {
      url: uploadUrl,
      fileSize: (data.get('file') as File)?.size,
      fileName: (data.get('file') as File)?.name,
      fileType: (data.get('file') as File)?.type,
      directory: data.get('directory'),
      apiEndpoint: apiUrl()
    });

    console.log('🔑 Checking auth headers and preparing request...');
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
        url: uploadUrl
      });
      throw new Error(`Error uploading video: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Video upload service successful:', {
      result,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      uploadedUrl: result.data,
      status: response.status,
      statusText: response.statusText
    });

    console.log('🎬 Video processing status:', {
      url: result.data,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    return result.data;
  } catch (e) {
    console.error('💥 Error in video upload service:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      url: uploadUrl,
      timestamp: new Date().toISOString()
    });
    throw e;
  }
};
