import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import NextAuth from 'next-auth';

// export function middleware(request: NextRequest) {
//   const { pathname, origin } = new URL(request.url);

//   // First URL pattern
//   const firstPattern = /^\/([^/]+)\/([^/]+)\/archive$/;
//   const firstMatch = pathname.match(firstPattern);

//   if (firstMatch) {
//     const baseEvent = firstMatch[2];
//     const newUrl = `${origin}/archive?event=${encodeURIComponent(baseEvent)}`;
//     return NextResponse.redirect(newUrl);
//   }

//   // Second URL pattern
//   const secondPattern = /^\/([^/]+)\/([^/]+)\/session\/([^/]+)$/;
//   const secondMatch = pathname.match(secondPattern);

//   if (secondMatch) {
//     const event = secondMatch[2];
//     const videoName = secondMatch[3];
//     const newUrl = `${origin}/watch?event=${encodeURIComponent(
//       event
//     )}&session=${encodeURIComponent(videoName)}`;
//     return NextResponse.redirect(newUrl);
//   }

//   return NextResponse.next();
// }

export const apiAuthPrefix = '/api/auth';
const authRoutes = ['/login'];
const publicRoutes = ['/'];
const protectedRoutes = ['/studio'];

export default auth((req) => {
  const { nextUrl } = req;
  const userSession = req.cookies.get('user-session')?.value;
  const isLoggedIn = !!req.auth;
  console.log('ROUTE', req.nextUrl.pathname);
  console.log('IS LOGGED IN', isLoggedIn);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const DEFAULT_LOGIN_REDIRECT = '/studio';

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  // Allow users visiting public routes to access them
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
