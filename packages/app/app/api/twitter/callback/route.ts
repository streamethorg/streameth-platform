import { apiUrl } from '@/lib/utils/utils';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { createOAuth, getUserProfileImage } from '@/lib/utils/twitterAuth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauthToken = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');
  const redirectUrl = decodeURIComponent(searchParams.get('redirectUrl')!);
  const organizationId = searchParams.get('organizationId');
  const authToken = cookies().get('user-session')?.value;
  const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET!;
  const oAuthSecret: any = JSON.parse(GOOGLE_OAUTH_SECRET);
  const originUrl = oAuthSecret.web.javascript_origins;

  if (!oauthToken || !authToken) {
    console.error('Twitter oauth token does not exist');
    return redirect(originUrl + redirectUrl);
  }

  const oauth = createOAuth();
  const url = 'https://api.twitter.com/oauth/access_token';
  const method = 'POST';
  const requestData = {
    url,
    method,
    data: { oauth_token: oauthToken, oauth_verifier: oauthVerifier },
  };
  const headers = oauth.toHeader(oauth.authorize(requestData));
  try {
    const responseToken = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
    });

    const responseText = await responseToken.text();
    const responseParams = new URLSearchParams(responseText);
    const oauthAccessToken = responseParams.get('oauth_token');
    const oauthAccessTokenSecret = responseParams.get('oauth_token_secret');
    const userId = responseParams.get('user_id');
    const screenName = responseParams.get('screen_name');
    // if (!screenName) {
    //   throw new Error(`Screen name not found`)
    // }
    // const userProfileImageUrl = await getUserProfileImage(screenName)

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
          type: 'twitter',
          accessToken: oauthAccessToken,
          refreshToken: oauthAccessTokenSecret,
          expireTime: Math.floor(Date.now() / 1000),
          name: screenName,
          thumbnail: '',
          channelId: userId,
        }),
      }
    );

    revalidatePath('/studio');
    return NextResponse.redirect(new URL(originUrl + redirectUrl, request.url));
  } catch (err) {
    return NextResponse.json(
      { error: err },
      {
        status: 500,
      }
    );
  }
}
