import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, origin } = new URL(request.url)

  // First URL pattern
  const firstPattern = /^\/([^/]+)\/([^/]+)\/archive$/
  const firstMatch = pathname.match(firstPattern)

  if (firstMatch) {
    const baseEvent = firstMatch[2]
    const newUrl = `${origin}/archive?event=${encodeURIComponent(
      baseEvent
    )}`
    return NextResponse.redirect(newUrl)
  }

  // Second URL pattern
  const secondPattern = /^\/([^/]+)\/([^/]+)\/session\/([^/]+)$/
  const secondMatch = pathname.match(secondPattern)

  if (secondMatch) {
    const event = secondMatch[2]
    const videoName = secondMatch[3]
    const newUrl = `${origin}/watch?event=${encodeURIComponent(
      event
    )}&session=${encodeURIComponent(videoName)}`
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}
