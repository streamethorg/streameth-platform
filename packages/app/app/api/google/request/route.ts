import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET || '';
  const oAuthSecret: any = JSON.parse(GOOGLE_OAUTH_SECRET);
  const clientId = oAuthSecret.web.client_id;
  const redirectUri = oAuthSecret.web.redirect_uri;

  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&prompt=select_account&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&state=${state}`;

  try {
    return NextResponse.redirect(authUrl);
  } catch (err) {
    return NextResponse.json(
      { error: err },
      {
        status: 500,
      }
    );
  }
}
