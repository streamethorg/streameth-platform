'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export const login = async (email: string, password: string) => {
  //   const user = await getUserByEmail(email);
  //   if (!user || !user.password) return null;
  //   const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  //   if (passwordMatch) return user;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/studio', // redirect to studio or callback url
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
};
