import { NextRequest, NextResponse } from 'next/server'
import Event from '@/server/model/event'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And the ones ending with:
     * - .png (image file)
     */
    '/((?!api|admin|_next/static|_next/image|favicon.ico)(?!.*\\.png$).*)',
  ],
}

export async function middleware(request: NextRequest) {
  let org
  let event
  let page

  try {
    org = request.url.split('/')[3]
    event = request.url.split('/')[4]
    page = request.url.split('/')[5]
    const url = new URL(`/api/organizations/${org}/events/${event}`, request.url).href
    const response = await fetch(url.replace('localhost', '127.0.0.1'), {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status)
    }
    const data: Event = await response.json()
    if (data.archiveMode && page !== 'archive' && page !== 'session') {
      return NextResponse.redirect(new URL(`/${org}/${event}/archive`, request.url))
    }
  } catch (e) {
    console.log(e)
  }
}
