import { NextRequest, NextResponse } from 'next/server'
import { createOAuth } from '@/lib/utils/twitterAuth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get('state')
  const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL!
  const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN!
  const TWITTER_ACCESS_TOKEN_SECRET =
    process.env.TWITTER_ACCESS_TOKEN_SECRET!

  const method = 'POST'
  const url = 'https://api.twitter.com/oauth/request_token'
  const decodedState = state
    ? JSON.parse(decodeURIComponent(state))
    : ''

  const callbackUrlWithParams = new URL(TWITTER_CALLBACK_URL)
  // Add personal redirect parameters to the callback URL
  Object.keys(decodedState).forEach((key) => {
    callbackUrlWithParams.searchParams.append(key, decodedState[key])
  })
  const callback = encodeURI(callbackUrlWithParams.toString())

  const oauth = createOAuth()

  const requestData = {
    url,
    method,
    data: { oauth_callback: callback },
  }
  const token = {
    key: TWITTER_ACCESS_TOKEN,
    secret: TWITTER_ACCESS_TOKEN_SECRET,
  }
  const headers = oauth.toHeader(oauth.authorize(requestData, token))

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
    })

    const responseText = await response.text()
    const responseParams = new URLSearchParams(responseText)
    const oauthToken = responseParams.get('oauth_token')

    return NextResponse.redirect(
      new URL(
        `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
        request.url
      )
    )
  } catch (err) {
    return NextResponse.json(
      { error: err },
      {
        status: 500,
      }
    )
  }
}
