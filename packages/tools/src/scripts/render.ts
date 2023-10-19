import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { getCompositions } from '@remotion/renderer'
import { webpackOverride } from '../webpack-override'
import { RenderMediaOnProgress, renderMedia, renderStill } from '@remotion/renderer'
import { CONFIG } from 'utils/config'
import { FileExists, UploadDrive } from 'services/slides'
import { existsSync, statSync } from 'fs'

let lastProgressPrinted = -1
const TEST_UPLOAD_DRIVE_ID = '1q6hzRnxuwI-KSNRknHbFJkGrohqNbK-V'

const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100)

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`)
    lastProgressPrinted = progressPercent
  }
}

const start = async () => {
  console.log(`Run Remotion renderer in ${CONFIG.NODE_ENV} mode..`)

  console.log('Create bundler..')
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  })

  console.log('Fetch compositions..')
  const compositions = await getCompositions(bundled)
  console.log('Total compositions #', compositions.length)

  // TODO: Create folder structure for assets/compositions

  for (const composition of compositions.filter((c) => c.id.includes('devconnect'))) {
    console.log(`Rendering ${composition.id}...`)

    const introFilePath = `assets/intros/${composition.id}.mp4`
    if (!fileExists(introFilePath)) {
      await renderMedia({
        codec: 'h264',
        composition,
        serveUrl: bundled,
        outputLocation: introFilePath,
        onProgress,
      })
    }
    upload(composition.id, introFilePath, 'video/mp4')

    const stillFilePath = `assets/stills/${composition.id}.png`
    if (!fileExists(stillFilePath) && composition.durationInFrames >= 299) {
      await renderStill({
        composition,
        serveUrl: bundled,
        frame: 299,
        output: stillFilePath,
      })
    }
    upload(composition.id, stillFilePath, 'image/png')

    lastProgressPrinted = -1
  }

  return
}
start()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

function fileExists(path: string, fileSize = 100000) {
  if (existsSync(path)) {
    const stats = statSync(path)
    // Making assumption that if file is bigger than a certain, it's an actual file
    return stats.size > fileSize
  }

  return false
}

async function upload(id: string, path: string, type: string) {
  // TODO: Need to properly fetch a Google Drive/Folder ID from Events Data
  // - CONFIG.GOOGLE_DRIVE_ID is the root shared Drive
  // - TEST_UPLOAD_DRIVE_ID is a (sub) folder within the root drive 
  if (CONFIG.GOOGLE_DRIVE_ID) {
    const exists = await FileExists(id, type, TEST_UPLOAD_DRIVE_ID)
    if (!exists) {
      await UploadDrive(id, path, type, TEST_UPLOAD_DRIVE_ID)
    }
  }
}