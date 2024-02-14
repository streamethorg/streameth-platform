import createOAuthClient from '@/lib/utils/googleAuth'
import { NextRequest, NextResponse } from 'next/server'

const SCOPES =
  'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly'

export async function GET(req: NextRequest) {
  const oAuthClient = await createOAuthClient()

  const authUrl = oAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })

  return NextResponse.json(authUrl, { status: 202 })
}
