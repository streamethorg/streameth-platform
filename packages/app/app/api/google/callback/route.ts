import {
  generateGoogleAccessToken,
  isStreamingEnabled,
} from '@/lib/utils/googleAuth'
import { apiUrl } from '@/lib/utils/utils'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const authuser = searchParams.get('authuser')
  const decodedState = state
    ? JSON.parse(decodeURIComponent(state))
    : ''
  const { redirectUrl, organizationId } = decodedState
  const authToken = cookies().get('user-session')?.value
  const originUrl = process.env.NEXT_PUBLIC_ORIGIN_URL || ''

  const parsedRedirectUrl = redirectUrl
    ? originUrl + redirectUrl
    : `/studio`

  if (!code || !authToken) {
    console.error('Google or auth token does not exist')
    return redirect(parsedRedirectUrl)
  }

  try {
    const tokenDetails = await generateGoogleAccessToken(code)
    // Check if streaming is enabled
    const streamEnabled = await isStreamingEnabled(
      tokenDetails.access_token
    )

    if (streamEnabled) {
      // Add new auth to streamETh server storage
      const response = await fetch(
        `${apiUrl()}/organizations/socials/${organizationId}`,
        {
          method: 'PUT',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            type: 'youtube',
            accessToken: tokenDetails.access_token,
            refreshToken: tokenDetails.refresh_token,
            expireTime:
              new Date().getTime() + tokenDetails.expires_in,
            name: tokenDetails.name,
            thumbnail: tokenDetails.thumbnail,
            channelId: tokenDetails.channelId,
          }),
        }
      )

      revalidatePath('/studio')
      return NextResponse.redirect(
        new URL(parsedRedirectUrl, request.url)
      )
    } else {
      return NextResponse.redirect(
        `${originUrl}/redirect/google?authuser=${authuser}`
      )
    }
  } catch (err) {
    return NextResponse.json(
      { error: err },
      {
        status: 500,
      }
    )
  }
}
