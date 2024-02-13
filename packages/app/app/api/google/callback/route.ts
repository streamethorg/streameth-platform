import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    console.error('Google token does not exist')
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : request.nextUrl.origin
    return NextResponse.redirect(`${baseUrl}/studio`)
  }

  const oneMonth = 31 * 24 * 60 * 60 * 1000 // Milliseconds in one month
  const cookieValue = `google_token=${code}; Secure; Max-Age=${
    oneMonth / 1000
  }; Path=/`

  // TODO: need to take a look at this
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : request.nextUrl.origin
  const response = NextResponse.redirect(`${baseUrl}/studio`)
  response.headers.set('Set-Cookie', cookieValue)

  return response
}
