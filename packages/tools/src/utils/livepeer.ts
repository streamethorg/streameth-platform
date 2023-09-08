import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { CONFIG } from './config'

export async function uploadAsset(session: any, path: string) {
  if (!CONFIG.LIVEPEER_API_KEY) {
    console.log('LIVEPEER_API_KEY is not defined')
    return
  }

  if (session.playback?.videoUrl || session.videoUrl) {
    console.log('Asset already uploaded', session.id)
    return
  }

  console.log('Upload asset', session.id, path)
  const { provider } = createClient({
    provider: studioProvider({
      apiKey: CONFIG.LIVEPEER_API_KEY,
    }),
  })

  const stream = createReadStream(path)
  const response = await provider.createAsset({
    sources: [
      {
        name: session.name ?? session.title,
        file: stream,
        storage: {
          ipfs: true,
          metadata: {
            name: session.name ?? session.title,
            ...session,
          },
        },
      },
    ],
  })

  if (!response[0]) { 
    console.warn('Asset upload failed')
    return response
  }

  const asset = response[0]

  if (session.id && session.eventId) {
    const sessionFilePath = join(CONFIG.DATA_FOLDER, 'sessions', session.eventId, `${session.id}.json`)
    if (existsSync(sessionFilePath) && asset) {
      console.log('Write session file', sessionFilePath)

      writeFileSync(
        sessionFilePath,
        JSON.stringify(
          {
            ...session,
            playback: {
              livepeerId: asset.playbackId,
              videoUrl: asset.playbackUrl,
              ipfsHash: asset.storage?.ipfs?.cid,
            },
          },
          null,
          2
        )
      )
    }
  }

  return asset
}
