import { join } from 'path'
import { bundle } from '@remotion/bundler'
import {
  getCompositions,
  renderMedia,
  renderStill,
  selectComposition,
  getVideoMetadata,
} from '@remotion/renderer'
import { RenderMediaOnProgress } from '@remotion/renderer'
import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { webpackOverride } from '../webpack-override'
import { CONFIG } from '../utils/config'
import { IEvent, ISession } from 'utils/types'
import { VideoProps } from 'compositions/join'
import { VideoConfig } from 'remotion'
import uploadAsset from 'utils/uploadAsset'

let lastProgressPrinted = -1

const uploadGoogledrive = true
const updateSessionThumbnails = true
const force = process.argv.slice(2).includes('--force')
const local = process.argv.slice(2).includes('--local')
const apiBaseUri = local
  ? 'http://localhost:3000/api'
  : 'https://app.streameth.org/api'
const processArgs = process.argv
  .slice(2)
  .filter((i) => !i.startsWith('--'))

if (!process.env.LIVEPEER_APIKEY) {
  console.error('process.env.LIVEPEER_APIKEY is not defined')
  process.exit(1)
}
const { provider } = createClient({
  provider: studioProvider({
    apiKey: process.env.LIVEPEER_APIKEY ?? '',
  }),
})

const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100)

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`)
    lastProgressPrinted = progressPercent
  }
}

async function start(args: string[]) {
  console.log(`Run Remotion renderer in ${CONFIG.NODE_ENV} mode..`)
  console.log('- API base uri', apiBaseUri)
  console.log('- force rendering', force)
  console.log('- update session thumbnails', updateSessionThumbnails)

  const res = await fetch(`${apiBaseUri}/events?inclUnlisted=true`)
  let events: IEvent[] = (await res.json())
    .filter((event: IEvent) => event.archiveMode === true)
    .filter((event: IEvent) => event.id.includes('secureum_trustx'))

  console.log()
  console.log('Events to render..')
  events.forEach((event) => console.log('-', event.id))
  console.log()

  if (args.length > 0) {
    const event = args[0]
    events = events.filter((e: any) => e.id === event)
  }

  for (const event of events) {
    const res = await fetch(
      `${apiBaseUri}/organizations/${event.organizationId}/events/${event.id}/sessions`
    )
    const sessions = await res.json()
    if (sessions.length === 0) {
      console.log('No sessions found. Skip rendering')
      continue
    }

    console.log('Find compositions...')
    const bundled = await bundle({
      entryPoint: join(process.cwd(), 'src', 'index.ts'),
      webpackOverride,
    })

    console.log('Fetching compositions...')
    const compositions = (await getCompositions(bundled)).filter(
      (c) => c.id.includes(event.id.replaceAll('_', '-'))
    )

    if (compositions.length === 0) {
      console.log('No compositions found. Skip rendering')
      return
    }

    for (const session of sessions) {
      const composition = compositions.filter((c) =>
        c.id.includes(session.id.replaceAll('_', '-'))
      )
      if (composition.length !== 1) {
        console.error(
          'Something went wrong filtering the compositions. Iterating to the next session'
        )
        continue
      }

      await generateEventAssets(
        session,
        composition[0],
        event,
        bundled
      )
    }
  }
}

async function generateEventAssets(
  session: ISession,
  composition: VideoConfig,
  event: any,
  bundled: string
) {
  console.log(`Generating assets for ${session.id}..`)

  let folderId = ''
  if (
    event.dataExporter?.length > 0 &&
    event.dataExporter[0].type === 'gdrive' &&
    event.dataExporter[0].config
  ) {
    folderId =
      event.dataExporter[0].config.sheetId ||
      event.dataExporter[0].config.driveId
    console.log('- Google Drive data exporter', folderId)
  }

  if (!folderId) {
    console.error(
      'No Google Drive data exporter found. Skip rendering'
    )
    return
  }

  const eventFolder = join(CONFIG.ASSET_FOLDER, event.id)
  const videoFolder = join(
    process.cwd(),
    `public/${event.id}/videos/`
  )
  const dataSessionFolder = join(
    process.cwd(),
    '../../data/sessions',
    event.id
  )
  const publicEventFolder = join(
    process.cwd(),
    '../../images/sessions',
    event.id
  )
  mkdirSync(eventFolder, { recursive: true })
  mkdirSync(publicEventFolder, { recursive: true })

  if (existsSync(`out/sessions/${composition.id}.mp4`)) {
    console.error('VideoFile already exists')
    return
  }

  const inputProps: VideoProps = {
    id: session.id,
    eventName: event.id,
  }
  console.log('Created inputProps', inputProps)

  const inputComposition = await selectComposition({
    serveUrl: bundled,
    id: composition.id,
    inputProps: inputProps,
  })

  const videoFile = videoFolder + session.id + '.mp4'
  if (!existsSync(videoFile)) {
    console.error(
      videoFile,
      ' does not exist. Iterating to next session'
    )
    return
  }
  const { durationInSeconds, fps } = await getVideoMetadata(videoFile)

  inputComposition.durationInFrames =
    Math.floor(durationInSeconds) * 25
  inputComposition.fps = 25

  console.log(`Started rendering ${composition.id}`)
  const videoFilePath = `out/${event.id}/videos/${composition.id}.mp4`
  await renderMedia({
    codec: 'h264',
    composition: inputComposition,
    serveUrl: bundled,
    outputLocation: videoFilePath,
    videoBitrate: '5M',
    onProgress,
  })
  lastProgressPrinted = -1

  if (uploadGoogledrive) {
    const id = `${session.id}_thumbnail.jpg`
    const type = 'video/mp4'

    uploadAsset(id, videoFilePath, type, folderId, force)
  }

  const thumbnailFilePath = `out/${event.id}/images/${composition.id}.jpg`
  await renderStill({
    composition: inputComposition,
    serveUrl: bundled,
    frame: fps, // First second
    output: thumbnailFilePath,
    inputProps,
  })

  if (uploadGoogledrive) {
    const id = `${session.id}_thumbnail.jpg`
    const type = 'image/png'

    uploadAsset(id, thumbnailFilePath, type, folderId, force)
  }

  // await uploadAsset(`out/sessions/${composition.id}.mp4`)
}

// async function uploadAsset(filePath: string) {
//   console.log('Uploading asset..')
//   const videoName = path.basename(filePath, '.mp4')
//   const stream = createReadStream(filePath)
//   await provider.createAsset({
//     sources: [
//       {
//         name: `${event}-${videoName}`,
//         file: stream,
//         storage: {
//           ipfs: true,
//           metadata: {
//             name: `${event}-${videoName}`,
//           },
//         },
//       },
//     ],
//   })
//
//   console.log(`Uploaded asset ${videoName}`)
// }

start(processArgs)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
