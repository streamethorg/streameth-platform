import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  // const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET || '';
  // const oAuthSecret: any = JSON.parse(GOOGLE_OAUTH_SECRET);
  // const clientId = oAuthSecret.web.client_id;
  // const redirectUri = oAuthSecret.web.redirect_uri;

  const googleAuthUrl = process.env.GOOGLE_OAUTH_URL;

  const authUrl = `${googleAuthUrl}&state=${state}`;

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
