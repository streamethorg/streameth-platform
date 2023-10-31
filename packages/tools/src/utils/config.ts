import path, { join } from 'path'
import dotenv from 'dotenv'
import { mkdirSync, rmSync, writeFileSync } from 'fs'

// Load configs from current and root folder
dotenv.config()
dotenv.config({ path: join(process.cwd(), '../../', '.env') })
dotenv.config({ path: join(process.cwd(), '../../', '.env.local') })

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  ASSET_FOLDER: process.env.ASSET_FOLDER || join(process.cwd(), '../../', 'assets'),
  DATA_FOLDER: process.env.DATA_FOLDER || join(process.cwd(), '../../', 'data'),
  BITRATE: process.env.BITRATE || 128,

  GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  LIVEPEER_API_KEY: process.env.NEXT_PUBLIC_STUDIO_API_KEY,

  GOOGLE_DRIVE_ID: process.env.GOOGLE_DRIVE_ID || '1AItNauHMqIoELY3bumagCr3G0hsldCRd',
}

export const GOOGLE_SA_CREDENTIALS = {
  type: 'service_account',
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
}
;(() => {
  console.log('Running in', CONFIG.NODE_ENV, 'mode')

  if (!process.env.GITHUB_API_TOKEN) {
    console.warn('GITHUB_API_TOKEN is not defined')
  }
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY is not defined')
  }
  if (!process.env.NEXT_PUBLIC_STUDIO_API_KEY) {
    console.warn('NEXT_PUBLIC_STUDIO_API_KEY is not defined')
  }

  if (
    process.env.GOOGLE_PROJECT_ID &&
    process.env.GOOGLE_PRIVATE_KEY_ID &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_X509_CERT_URL
  ) {
    console.log('Create required folders at', CONFIG.ASSET_FOLDER)
    writeFileSync(path.join(__dirname, '../../', 'google_sa_secret.json'), JSON.stringify(GOOGLE_SA_CREDENTIALS, null, 2))
  } else {
    console.warn('Google Service Account credentials are not set. Skip creating google_sa_secret.json')
  }

  console.log('Create required folders at', CONFIG.ASSET_FOLDER)
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'images', 'hd'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'images', 'social'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'intros'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'outros'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'sessions'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'splits'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'tmp'), { recursive: true })
})()

export function resetTmpFolder() {
  rmSync(join(CONFIG.ASSET_FOLDER, 'tmp'), {
    recursive: true,
    force: true,
  })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'tmp'), { recursive: true })
}
