'use server';
import { revalidatePath } from 'next/cache';
import { imageUpload } from '../services/imageUploadService';

export const imageUploadAction = async ({ data }: { data: FormData }) => {
  try {
    const res = await imageUpload({
      data,
    });
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('Error uploading image acton');
    return '';
  }
};
