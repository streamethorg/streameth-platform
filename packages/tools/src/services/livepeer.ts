import fs from 'fs'
import { cwd } from 'process'
import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { CONFIG } from '../utils/config'
import { ISession } from '../utils/types'
import axios from 'axios'

const { provider } = createClient({
  provider: studioProvider({
    apiKey: CONFIG.LIVEPEER_API_KEY || '',
  }),
})

export async function downloadVideoFromLivepeer(
  videoName: string,
  event: string,
  playbackId: string
): Promise<void> {
  const res = await provider.getPlaybackInfo(playbackId)
  if (!res.type) {
    throw new Error('playbackId does not exist')
  }

  const videoUrl = res.meta.source[0].url
  console.log(`Downloading video ${playbackId} from Livepeer...`)

  const response = await axios({
    method: 'get',
    url: videoUrl,
    responseType: 'stream',
  })

  const writer = fs.createWriteStream(
    `${cwd()}/public/${event}/videos/${videoName}.mp4`
  )
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log(
        `Video ${playbackId} has been downloaded from Livepeer`
      )
      resolve()
    })
    writer.on('error', reject)
  })
}

export async function uploadAssetToLivepeer(
  session: ISession,
  path: string
) {
  if (!CONFIG.LIVEPEER_API_KEY && !process.env.LIVEPEER_API_KEY) {
    console.log('LIVEPEER_API_KEY is not defined')
    return
  }

  if (session.videoUrl) {
    console.log('Asset already uploaded', session.id)
    return
  }

  if (!fs.existsSync(path)) {
    console.log('File does not exist', path)
    return
  }

  console.log('Upload asset', session.id, path)
  const stream = createReadStream(path)
  const response = await provider.createAsset({
    sources: [
      {
        name: session.name,
        file: stream,
        storage: {
          ipfs: true,
          metadata: {
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
    const sessionFilePath = join(
      CONFIG.DATA_FOLDER,
      'sessions',
      session.eventId,
      `${session.id}.json`
    )
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
              format: asset.videoSpec?.format,
              duration: asset.videoSpec?.duration,
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
