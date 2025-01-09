'use server';
import { revalidatePath } from 'next/cache';
import { videoUpload } from '../services/videoUploadService';

export const videoUploadAction = async ({ data }: { data: FormData }) => {
  try {
    const res = await videoUpload({
      data,
    });
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('Error uploading video action');
    return '';
  }
};
