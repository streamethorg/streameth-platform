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
    async jwt({ token, account, user }) {
      if (account && user) {
        // Exchange the NextAuth token for backend JWT
        try {
          const response = await fetch(`${apiUrl()}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: account.id_token,
            }),
          });
          const data = await response.json();
          token.access_token = data.data?.token;
        } catch (error) {
          console.error('Error fetching session token:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        try {
          const response = await fetch(`${apiUrl()}/auth/verify-token`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: token.access_token,
            }),
          });
          const data = await response.json();

          if (data.data === false) {
            // Token is invalid or expired, log out the user
            await signOut({ redirect: false });
            return session;
          }

          // Token is valid, set the accessToken in the session
          session.accessToken = token.access_token as string;
        } catch (error) {
          console.error('Error verifying session token:', error);
          // In case of an error, log out the user as a precaution
          await signOut({ redirect: false });
          return session;
        }
      }

      return session;
    },
  },
});
