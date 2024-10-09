'use server';

import { magicLinkSignIn } from '../services/authService';

export const magicLinkSignInAction = async ({ email }: { email: string }) => {
  const response = await magicLinkSignIn({
    email,
  });

  if (!response) {
    throw new Error('Error sending magic link');
  }

  return response;
};
