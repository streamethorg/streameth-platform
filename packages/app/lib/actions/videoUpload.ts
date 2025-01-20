'use server';
import { revalidatePath } from 'next/cache';
import { videoUpload } from '../services/videoUploadService';

export const videoUploadAction = async ({ data }: { data: FormData }) => {
  try {
    console.log('📤 Starting video upload action');
    console.log('📁 FormData contents:', {
      fileName: (data.get('file') as File)?.name,
      directory: data.get('directory'),
      fileSize: (data.get('file') as File)?.size,
    });

    const res = await videoUpload({
      data,
    });
    console.log('✨ Video upload action completed successfully');
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('💥 Error in video upload action:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined
    });
    throw e;
  }
};
