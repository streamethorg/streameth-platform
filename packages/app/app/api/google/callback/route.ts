import createOAuthClient from '@/lib/utils/googleAuth'
import { Credentials } from 'google-auth-library'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    console.error('Google token does not exist')
    return redirect(`/studio`)
  }

  try {
    const oAuthClient = await createOAuthClient()

    const tokens = await new Promise((resolve, reject) => {
      oAuthClient.getToken(code, (err, tokens) => {
        if (err) {
          reject(err)
        } else if (!tokens) {
          reject('Tokens do not exist')
        }

        resolve(tokens)
      })
    })

    oAuthClient.setCredentials(tokens as Credentials)

    return NextResponse.redirect('http://localhost:3000/studio')
  } catch (err) {
    return NextResponse.json(
      { error: err },
      {
        status: 500,
      }
    )
  }
}
