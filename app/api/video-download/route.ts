import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const url = new URL(req.url)

    const playbackId = url.searchParams.get('playbackId')
    const Authorization = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY
    if (!playbackId) {
      return NextResponse.json('Missing playbackId', { status: 401 })
    }
    if (!Authorization) {
      return NextResponse.json('Missing Authorization Token', {
        status: 401,
      })
    }

    const response = await fetch(
      `https://livepeer.studio/api/playback/${playbackId}`,
      {
        method: 'GET',
        headers: {
          Authorization: Authorization,
        },
      }
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json('Internal Server Error', { status: 500 })
  }
}
