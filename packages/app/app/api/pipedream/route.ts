import { NextRequest, NextResponse } from 'next/server';

const DEVCON_UPLOAD_ENDPOINT = process.env.DEVCON_UPLOAD_ENDPOINT;
const PIPEDREAM_AUTH_TOKEN = process.env.PIPEDREAM_AUTH_TOKEN;

export async function POST(request: NextRequest) {
  if (!DEVCON_UPLOAD_ENDPOINT) {
    return NextResponse.json(
      { error: 'DEVCON_UPLOAD_ENDPOINT is not configured' },
      { status: 500 }
    );
  }

  if (!PIPEDREAM_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'PIPEDREAM_AUTH_TOKEN is not configured' },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();

    const response = await fetch(DEVCON_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PIPEDREAM_AUTH_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // Validate the response
    if (responseData.devconUpload?.result !== null) {
      return NextResponse.json(
        { error: 'Failed to upload to Devcon API' },
        { status: 400 }
      );
    }
    if (responseData.video?.status !== 'uploaded') {
      return NextResponse.json(
        { error: 'Failed to upload video to Devcon YouTube' },
        { status: 400 }
      );
    }
    if (responseData.thumbnail?.status !== 200) {
      return NextResponse.json(
        { error: 'Failed to upload thumbnail to Devcon YouTube' },
        { status: 400 }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Devcon upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
