import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { webpackOverride } from '../webpack-override'
import { RenderMediaOnProgress, getCompositions, selectComposition, renderMedia, renderStill } from '@remotion/renderer'
import { CONFIG } from 'utils/config'
import { FileExists, UploadDrive, UploadOrUpdate } from 'services/slides'
import { existsSync, mkdirSync, statSync } from 'fs'
import { staticFile } from 'remotion'

const force = process.argv.slice(2).includes('--force')
const local = process.argv.slice(2).includes('--local')
const processArgs = process.argv.slice(2).filter(i => !i.startsWith('--'))
const apiBaseUri = local ? 'http://localhost:3000/api' : 'https://app.streameth.org/api'

start(processArgs)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

async function start(args: string[]) {
  console.log(`Run ZuConnect renderer in ${CONFIG.NODE_ENV} mode..`)
  console.log('- API base uri', apiBaseUri)
  console.log('- force rendering', force)

  const res = await fetch(`${apiBaseUri}/events`)
  let events = (await res.json()).filter((i: any) => i.archiveMode === false)
    .filter((event: any) => event.organizationId === 'zuzalu')

  console.log()
  console.log('Events to render..')
  events.forEach((i: any) => console.log('-', i.id))
  console.log()

  if (args.length > 0) {
    const event = args[0]
    events = events.filter((e: any) => e.id === event)
  }

  for (const event of events) {
    await generateEventVideos(event)
  }
}

async function generateEventVideos(event: any) {
  console.log(`Generating videos for ${event.id}..`)
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  })

  const compositions = await getCompositions(bundled)
  const joinerComposition = compositions.find((c) => c.id === 'joiner')
  if (!joinerComposition) {
    console.log('Joiner Composition not found. Skip rendering')
    return
  }

  const res = await fetch(`${apiBaseUri}/organizations/${event.organizationId}/events/${event.id}/sessions`)
  const sessions = await res.json()
  const sessionsToProcess = sessions.filter((s: any) => s.videoType === 'clip' && s.videoUrl)
  if (sessions.length === 0) {
    console.log('No sessions clips found. Skip rendering')
    return
  }

  let folderId = ''
  if (event.dataExporter?.length > 0 && event.dataExporter[0].type === 'gdrive' && event.dataExporter[0].config) {
    folderId = event.dataExporter[0].config.sheetId || event.dataExporter[0].config.driveId
    console.log('- Google Drive data exporter', folderId)
  }
  if (!folderId) {
    console.error('No Google Drive data exporter found. Skip rendering')
  }

  const eventFolder = join(CONFIG.ASSET_FOLDER, event.id)
  mkdirSync(eventFolder, { recursive: true })

  console.log(`Render ${compositions.length} compositions for # ${sessions.length} sessions`)
  for (let index = 0; index < sessionsToProcess.length; index++) {
    const session = sessionsToProcess[index]
    console.log(`Session # ${index + 1} - ${session.id}`)

    try {
      const inputVideoProps = {
        videos: [{
          pathOrUrl: staticFile('zuzalu/zuconnect/sample-intro.mp4'),
          duration: 50 // TODO:
        }, {
          pathOrUrl: session.videoUrl,
          duration: getVideoDuration(session.videoUrl)
        }]
      }

      const inputComposition = await selectComposition({
        serveUrl: bundled,
        id: joinerComposition.id,
        inputProps: inputVideoProps,
      })

      const id = `${session.id}.mp4`
      const type = 'video/mp4'
      const sessionPath = `${eventFolder}/${id}`

      const exists = fileExists(sessionPath)
      if (!exists || force) {
        await renderMedia({
          codec: 'h264',
          composition: inputComposition,
          serveUrl: bundled,
          outputLocation: sessionPath,
          inputProps: inputVideoProps
        })
      }

      // AddOrUpdate file on Github
      // 

      if (folderId) {
        const fileExported = await FileExists(id, 'video/mp4', folderId) ?? false
        if (!fileExported || force) {
          upload(id, sessionPath, type, folderId)
        }
      }

    } catch (err) {
      console.log('Error rendering session', err)
    }
  }
}

function getVideoDuration(pathOrUrl: string) {
  // https://www.npmjs.com/package/ffprobe-client
}

function fileExists(path: string, fileSize = 100000) {
  if (existsSync(path)) {
    const stats = statSync(path)
    // Making assumption that if file is bigger than a certain, it's an actual file
    return stats.size > fileSize
  }

  return false
}

async function upload(id: string, path: string, type: string, folderId: string) {
  // - CONFIG.GOOGLE_DRIVE_ID is main, root drive. Files are upload to their respective sub folder Ids
  if (CONFIG.GOOGLE_DRIVE_ID) {
    if (force) {
      await UploadOrUpdate(id, path, type, folderId)
      return
    }

    const exists = await FileExists(id, type, folderId)
    if (!exists) {
      await UploadDrive(id, path, type, folderId)
    }
  }
}
