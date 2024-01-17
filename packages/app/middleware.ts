import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, origin } = new URL(request.url);
    const pathRegex = /^\/([^/]+)\/([^/]+)\/archive$/;
    const match = pathname.match(pathRegex);

    if (match) {
        const baseEvent = match[2];
        const newUrl = `${origin}/archive?event=${encodeURIComponent(baseEvent)}`;
        return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
}
