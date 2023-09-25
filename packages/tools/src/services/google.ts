import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import path from 'path'

export async function Authenticate(scopes: string[]) {
  console.log('Authenticating with Google', scopes)

  // MAKE SURE NOT TO COMMIT THE SECRET FILES
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../../', 'google_client_secret.json'),
    scopes,
  })
  google.options({ auth })

  return google
}

export async function AuthenticateServiceAccount(scopes: string[]) {
  console.log('Authenticating with Google', scopes)

  // MAKE SURE NOT TO COMMIT THE SECRET FILES
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../../', 'google_sa_secret.json'),
    scopes,
  })
  google.options({ auth })

  return google
}
