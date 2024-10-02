import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { apiUrl } from './lib/utils/utils';

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
    async jwt({ token, account, profile }) {
      console.log('account', account);
      console.log('profile', profile);
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.email = profile?.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Exchange the NextAuth token for your backend JWT
      const response = await fetch(`${apiUrl}/login'`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: token.provider,
          providerAccountId: token.providerAccountId,
          email: token.email,
        }),
      });
      const data = await response.json();
      session.sessionToken = data.token;
      return session;
    },
  },
});
