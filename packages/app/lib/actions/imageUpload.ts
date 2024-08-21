'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { imageUpload } from '../services/imageUploadService';

export const imageUploadAction = async ({ data }: { data: FormData }) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  try {
    const res = await imageUpload({
      data,
      authToken,
    });
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('Error uploading image acton');
    return '';
  }
};
