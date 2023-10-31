import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { getCompositions } from '@remotion/renderer'
import { webpackOverride } from '../webpack-override'
import { RenderMediaOnProgress, renderMedia, renderStill } from '@remotion/renderer'
import { CONFIG } from 'utils/config'
import { FileExists, UploadDrive } from 'services/slides'
import { existsSync, mkdirSync, statSync } from 'fs'

const apiBaseUri = 'http://localhost:3000/api'

start(process.argv.slice(2))
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

async function start(args: string[]) {
  console.log(`Run Remotion renderer in ${CONFIG.NODE_ENV} mode..`)

  console.log('Fetch non-archived events..')
  const res = await fetch(`${apiBaseUri}/events`)
  let events = (await res.json()).filter((i: any) => i.archiveMode === false)

  if (args.length > 0) {
    const event = args[0]
    events = events.filter((e: any) => e.id === event)
  }

  for (const event of events) {
    await generateEventAssets(event)
  }

  return
}

async function generateEventAssets(event: any) {
  console.log(`Generating assets for ${event.id}..`)
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  })

  console.log('Fetch compositions..')
  const compositions = (await getCompositions(bundled)).filter((c) => c.id.includes(event.id) || c.id.includes(event.id.replace('_', '-')))
  if (compositions.length === 0) {
    console.log('No compositions found for. Skip rendering')
    return
  }

  console.log('Fetch sessions..')
  const res = await fetch(`${apiBaseUri}/organizations/${event.organizationId}/events/${event.id}/sessions`)
  const sessions = await res.json()
  if (sessions.length === 0) {
    console.log('No sessions found for. Skip rendering')
    return
  }

  let folderId = ''
  if (event.dataExporter?.length > 0 && event.dataExporter[0].type === 'gdrive' && event.dataExporter[0].config) {
    folderId = event.dataExporter[0].config.sheetId || event.dataExporter[0].config.driveId
    console.log('Using Google Drive data exporter to folder', folderId)
  }

  const introFolder = join(CONFIG.ASSET_FOLDER, event.id, 'intros')
  const socialFolder = join(CONFIG.ASSET_FOLDER, event.id, 'social')
  mkdirSync(introFolder, { recursive: true })
  mkdirSync(socialFolder, { recursive: true })

  console.log(`Render ${compositions.length} compositions for # ${sessions.length} sessions`)
  for (const session of sessions) {
    console.log(' -', session.id)

    for (const composition of compositions) {

      // Only render compositions that have frames
      if (composition.durationInFrames > 1) {
        const introFilePath = `${introFolder}/${composition.id}.mp4`
        if (!fileExists(introFilePath)) {
          await renderMedia({
            codec: 'h264',
            composition,
            serveUrl: bundled,
            outputLocation: introFilePath,
            inputProps: { session },
            onProgress,
          })
        }

        if (folderId) upload(composition.id, introFilePath, 'video/mp4', folderId)

        // Generate a still from the same composition's last frame
        const introStillPath = `${introFolder}/${composition.id}.png`
        if (!fileExists(introStillPath)) {
          await renderStill({
            composition,
            serveUrl: bundled,
            frame: composition.durationInFrames - 1,
            output: introStillPath,
            inputProps: { session },
          })
        }

        if (folderId) upload(composition.id, introStillPath, 'image/png', folderId)
      }

      lastProgressPrinted = -1
    }
  }
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
    const exists = await FileExists(id, type, folderId)
    if (!exists) {
      await UploadDrive(id, path, type, folderId)
    }
  }
}

let lastProgressPrinted = -1
const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100)

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`)
    lastProgressPrinted = progressPercent
  }
}
