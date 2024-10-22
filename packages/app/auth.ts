import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiUrl, getTokenExpiration } from './lib/utils/utils';

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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        const response = await fetch(`${apiUrl()}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: credentials.token,
            type: 'email',
            email: credentials.email,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed or token expired'); // Throw an error for failed login
        }

        const data = await response.json();

        const userData = {
          email: credentials.email as string,
          token: data.data?.token,
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/auth-error',
    verifyRequest: '/auth/magic-link',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === 'credentials' && user) {
        const userWithToken = user as { token: string }; // Type assertion
        token.access_token = userWithToken.token;
      }
      if (account && account?.provider === 'google') {
        // Exchange the NextAuth token for backend JWT
        try {
          const response = await fetch(`${apiUrl()}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: account.id_token,
              type: 'google',
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
        // Extract expiration time from the access token
        const expTime = getTokenExpiration(token.access_token as string);
        const currentTime = Math.floor(Date.now() / 1000);
        if (expTime && currentTime < expTime) {
          // Token is still valid, set the accessToken in the session
          session.accessToken = token.access_token as string;
        } else {
          // Token has expired or expiration time couldn't be extracted, verify with the server
          try {
            const response = await fetch(`${apiUrl()}/auth/verify-token`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: token.access_token,
              }),
            });
            if (!response.ok) {
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
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
