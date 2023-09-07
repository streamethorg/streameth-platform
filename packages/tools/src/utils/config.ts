import { join } from 'path'
import dotenv from 'dotenv'
import { mkdirSync } from 'fs'

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

  console.log('Create required folders at', CONFIG.ASSET_FOLDER)
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'images', 'hd'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'images', 'social'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'intros'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'outros'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'sessions'), { recursive: true })
  mkdirSync(join(CONFIG.ASSET_FOLDER, 'splits'), { recursive: true })
})()
