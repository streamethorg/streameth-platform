'use server';
import { revalidatePath } from 'next/cache';
import { videoUpload } from '../services/videoUploadService';

export const videoUploadAction = async ({ data }: { data: FormData }) => {
  try {
    console.log('📤 Starting video upload action with details:', {
      fileName: (data.get('file') as File)?.name,
      fileSize: `${((data.get('file') as File)?.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: (data.get('file') as File)?.type,
      directory: data.get('directory'),
      formDataKeys: Array.from(data.keys()),
      timestamp: new Date().toISOString()
    });

    // Validate form data
    const file = data.get('file') as File;
    const directory = data.get('directory');
    
    if (!file) {
      console.error('❌ Video upload validation failed: No file in FormData');
      throw new Error('No file provided');
    }
    
    if (!directory) {
      console.error('❌ Video upload validation failed: No directory in FormData');
      throw new Error('No directory provided');
    }

    console.log('✅ FormData validation passed, calling video upload service');
    
    const res = await videoUpload({
      data,
    }).catch(error => {
      console.error('❌ Video upload service failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: file.name,
        fileSize: file.size,
        directory
      });
      throw error;
    });

    if (!res) {
      console.error('❌ Video upload failed: No response from upload service');
      throw new Error('No response from upload service');
    }

    console.log('✨ Video upload action completed successfully:', {
      result: res,
      fileName: file.name,
      directory
    });

    revalidatePath('/studio');
    return res;
  } catch (e) {
    console.error('💥 Error in video upload action:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      formDataKeys: Array.from(data.keys()),
      timestamp: new Date().toISOString()
    });
    throw e;
  }
};
