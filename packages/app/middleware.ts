import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

function matcher(request: NextRequest) {
  const { pathname, origin } = new URL(request.url);

  // URL patterns for redirection
  const patterns = [
    { regex: /^\/([^/]+)\/([^/]+)\/archive$/, newPath: '/archive?event=' },
    {
      regex: /^\/([^/]+)\/([^/]+)\/session\/([^/]+)$/,
      newPath: '/watch?event=',
    },
  ];

  for (const { regex, newPath } of patterns) {
    const match = pathname.match(regex);
    if (match) {
      const event = encodeURIComponent(match[2]);
      let newUrl = `${origin}${newPath}${event}`;
      if (newPath.includes('watch')) {
        newUrl += `&session=${encodeURIComponent(match[3])}`;
      }
      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}

const apiAuthPrefix = '/api/auth';
const authRoutes = [
  '/auth/login',
  '/auth/auth-success',
  '/auth/auth-error',
  '/auth/magic-link',
];
const publicRoutes = ['/'];
const studioPath = '/studio';
const protectedRoutes = ['/data-request'];

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute =
    nextUrl.pathname.startsWith(studioPath) ||
    protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const DEFAULT_LOGIN_REDIRECT = '/studio';

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && isProtectedRoute) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Call the middleware function for URL pattern matching
  const middlewareResult = matcher(req);
  if (middlewareResult) {
    return middlewareResult;
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
