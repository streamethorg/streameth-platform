import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { getCompositions, renderMedia } from '@remotion/renderer'
import { RenderMediaOnProgress } from '@remotion/renderer'
import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream } from 'fs'
import path from 'path'
import { webpackOverride } from '../webpack-override'

let lastProgressPrinted = -1
let event = 'secureum'

const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100)

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`)
    lastProgressPrinted = progressPercent
  }
}

if (!process.env.LIVEPEER_APIKEY) {
  console.error('process.env.LIVEPEER_APIKEY is not defined')
}

const { provider } = createClient({
  provider: studioProvider({
    apiKey: process.env.LIVEPEER_APIKEY ?? '',
  }),
})

const start = async () => {
  console.log('Find compositions...')
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride,
  })

  console.log('Fetching compositions...')
  const compositions = await getCompositions(bundled)

  if (compositions) {
    for (const composition of compositions) {
      if (!composition.id.includes('secureum')) {
        continue
      }
      console.log(`Started rendering ${composition.id}`)

      await renderMedia({
        codec: 'h264',
        composition,
        serveUrl: bundled,
        outputLocation: `out/sessions/${composition.id}.mp4`,
        videoBitrate: '5M',
        onProgress,
      })

      lastProgressPrinted = -1
      await uploadAsset(`out/sessions/${composition.id}.mp4`)
    }
  }
}

async function uploadAsset(filePath: string) {
  console.log('Uploading asset..')
  const videoName = path.basename(filePath, '.mp4')
  const stream = createReadStream(filePath)
  await provider.createAsset({
    sources: [
      {
        name: `${event}-${videoName}`,
        file: stream,
        storage: {
          ipfs: true,
          metadata: {
            name: `${event}-${videoName}`,
          },
        },
      },
    ],
  })

  console.log(`Uploaded asset ${videoName}`)
}

start()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
