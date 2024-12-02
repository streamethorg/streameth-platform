import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl, getTokenExpiration } from "./lib/utils/utils";

// Extend the built-in session type
declare module "next-auth" {
	interface Session extends DefaultSession {
		accessToken?: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: { 
				params: { 
					access_type: "offline", 
					prompt: "consent", 
					scope: "email profile",
					response_type: "code",
					include_granted_scopes: true
				} 
			},
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
					token: { label: "Token", type: "text" },
			},
			async authorize(credentials) {
				const response = await fetch(`${apiUrl()}/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token: credentials.token,
						type: "email",
						email: credentials.email,
					}),
				});

				if (!response.ok) {
					throw new Error("Login failed or token expired"); // Throw an error for failed login
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
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/auth-error",
		verifyRequest: "/auth/magic-link",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === "google" && profile?.email) {
				// Store email for later use in jwt callback
				user.email = profile.email;
				return true;
			}
			return true;
		},
		async jwt({ token, account, profile, user }) {
			if (account?.provider === "google") {
				try {
					const email = (account.email || user?.email || token.email) as string;
					
					const response = await fetch(`${apiUrl()}/auth/login`, {
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							token: account.id_token,
							type: "google",
							email: email,
						}),
					});

					if (!response.ok) {
						const errorText = await response.text();
						console.error("Auth error response:", errorText);
						throw new Error("AuthError");
					}

					const data = await response.json();
					token.access_token = data.data?.token;
					if (email) {
						token.email = email as string | null;
					}
				} catch (error) {
					console.error("Error in Google auth:", error);
					throw new Error("AuthError");
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				// Ensure email is copied from token to session
				if (token.email) {
					session.user = session.user || {};
					session.user.email = token.email;
				}
				
				// Handle access token
				const expTime = getTokenExpiration(token.access_token as string);
				const currentTime = Math.floor(Date.now() / 1000);
				if (expTime && currentTime < expTime) {
					session.accessToken = token.access_token as string;
				} else {
					try {
						const response = await fetch(`${apiUrl()}/auth/verify-token`, {
							method: "POST",
							credentials: "include",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								token: token.access_token,
							}),
						});
						if (!response.ok) {
							await signOut({ redirect: false });
							return session;
						}
						session.accessToken = token.access_token as string;
					} catch (error) {
						console.error("Error verifying session token:", error);
						await signOut({ redirect: false });
						return session;
					}
				}
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
	debug: true, // Enable debug mode
});
