'use server';

import { revalidatePath } from 'next/cache';
import { emailSignIn } from '../services/authService';

export const emailSignInAction = async ({ email }: { email: string }) => {
  const response = await emailSignIn({
    email,
  });

  if (!response) {
    throw new Error('Error creating stage');
  }
  revalidatePath('/studio');
  return response;
};
