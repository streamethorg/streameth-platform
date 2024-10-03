import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { apiUrl } from './lib/utils/utils';

// Extend the built-in session type
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Exchange the NextAuth token for backend JWT
      try {
        const response = await fetch(`${apiUrl()}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: token.access_token,
          }),
        });
        const data = (await response.json()).data;
        session.accessToken = data?.token;
      } catch (error) {
        console.error('Error fetching session token:', error);
      }
      return session;
    },
  },
});
