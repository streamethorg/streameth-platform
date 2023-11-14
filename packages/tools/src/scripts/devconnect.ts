import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { webpackOverride } from '../webpack-override'
import { getCompositions, selectComposition, renderMedia, renderStill } from '@remotion/renderer'
import { CONFIG } from 'utils/config'
import { FileExists, UploadDrive, UploadOrUpdate } from 'services/slides'
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { DevconnectEvents } from 'compositions/devconnect'
import { validImageUrl } from 'utils/avatars'

const uploadGoogledrive = false
const updateSessionThumbnails = true
const force = process.argv.slice(2).includes('--force')
const local = process.argv.slice(2).includes('--local')
const processArgs = process.argv.slice(2).filter(i => !i.startsWith('--'))
const apiBaseUri = local ? 'http://localhost:3000/api' : 'https://app.streameth.org/api'
const devconnectEvents = DevconnectEvents.map(i => ({ ...i, id: i.id.replaceAll('-', '_') }))

start(processArgs)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

async function start(args: string[]) {
  console.log(`Run Remotion renderer in ${CONFIG.NODE_ENV} mode..`)
  console.log('- API base uri', apiBaseUri)
  console.log('- force rendering', force)
  console.log('- update session thumbnails', updateSessionThumbnails)

  const res = await fetch(`${apiBaseUri}/events?inclUnlisted=true`)
  let events = (await res.json()).filter((i: any) => i.archiveMode === false)
    // filter for Devconnect events
    .filter((event: any) => devconnectEvents.some(i => i.id === event.id)) // event.organizationId === 'devconnect'

  console.log()
  console.log('Events to render..')
  events.forEach((i: any) => console.log('-', i.id))
  console.log()

  if (args.length > 0) {
    const event = args[0]
    events = events.filter((e: any) => e.id === event)
  }

  for (const event of events) {
    await generateEventAssets(event)
  }
}

async function generateEventAssets(event: any) {
  console.log(`Generating assets for ${event.id}..`)
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  })

  const compositions = (await getCompositions(bundled)).filter((c) => !c.id.startsWith('join-') && c.id.includes(event.id) || c.id.includes(event.id.replaceAll('_', '-')))
  if (compositions.length === 0) {
    console.log('No compositions found. Skip rendering')
    return
  }

  const res = await fetch(`${apiBaseUri}/organizations/${event.organizationId}/events/${event.id}/sessions`)
  const sessions = await res.json()
  if (sessions.length === 0) {
    console.log('No sessions found. Skip rendering')
    return
  }

  let folderId = ''
  if (event.dataExporter?.length > 0 && event.dataExporter[0].type === 'gdrive' && event.dataExporter[0].config) {
    folderId = event.dataExporter[0].config.sheetId || event.dataExporter[0].config.driveId
    console.log('- Google Drive data exporter', folderId)
  }

  if (!folderId) {
    console.error('No Google Drive data exporter found. Skip rendering')
    return
  }

  const eventFolder = join(CONFIG.ASSET_FOLDER, event.id)
  const dataSessionFolder = join(process.cwd(), '../../data/sessions', event.id)
  const publicEventFolder = join(process.cwd(), '../../public/sessions', event.id)
  mkdirSync(eventFolder, { recursive: true })
  mkdirSync(publicEventFolder, { recursive: true })

  const eventType = devconnectEvents.find(e => e.id === event.id)?.type || '1'
  console.log('- Event Composition Type', eventType)

  // TODO: Kinda hacky solution to check invalid Image urls here.
  // This should get fixed on data entry or import
  let sessionsToProcess: any[] = []
  for (const session of sessions) {
    const s = {
      id: session.id,
      name: session.name,
      start: session.start,
      stageId: session.stageId,
      speakers: Array<any>(),
    }

    for (const speaker of session.speakers) {
      const hasValidPhoto = await validImageUrl(speaker.photo)
      s.speakers.push({
        id: speaker.id,
        name: speaker.name,
        photo: hasValidPhoto ? speaker.photo : undefined,
      })
    }

    sessionsToProcess.push(s)
  }

  sessionsToProcess = sessionsToProcess.sort((a, b) => a - b)
  console.log(`Render ${compositions.length} compositions for # ${sessions.length} sessions`)
  for (let index = 0; index < sessionsToProcess.length; index++) {
    const session = sessionsToProcess[index]
    console.log(`Session # ${index + 1} - ${session.id}`)

    try {
      const inputProps = { type: eventType, id: event.id.replaceAll('_', '-'), session: session }

      for (const composition of compositions) {
        const inputComposition = await selectComposition({
          serveUrl: bundled,
          id: composition.id,
          inputProps: inputProps,
        })

        // Render Stills
        if (composition.durationInFrames === 1) {
          const id = `${session.id}_social.png`
          const type = 'image/png'
          const socialFilePath = `${eventFolder}/${id}`

          if (folderId) {
            const fileExported = await FileExists(id, type, folderId) ?? false
            if (!fileExported || force) {
              const exists = fileExists(socialFilePath)
              if (!exists || force) {
                await renderStill({
                  composition: inputComposition,
                  serveUrl: bundled,
                  output: socialFilePath,
                  inputProps: inputProps,
                })
              }

              upload(id, socialFilePath, type, folderId)
            }
          }
        }

        // Only render compositions that have frames
        if (composition.durationInFrames > 1) {
          const id = `${session.id}_intro.mp4`
          const type = 'video/mp4'
          const introFilePath = `${eventFolder}/${id}`

          if (folderId) {
            const fileExported = await FileExists(id, type, folderId) ?? false
            if (!fileExported || force) {
              const exists = fileExists(introFilePath)
              if (!exists || force) {
                await renderMedia({
                  codec: 'h264',
                  composition: inputComposition,
                  serveUrl: bundled,
                  outputLocation: introFilePath,
                  inputProps,
                  // onProgress,
                })
              }

              upload(id, introFilePath, type, folderId)
            }

            // Generate a still from the same composition's last frame
            const thumbnailId = `${session.id}_thumbnail.png`
            const thumbnailType = 'image/png'
            const thumbnailFilePath = `${eventFolder}/${thumbnailId}`
            const thumbnailExported = await FileExists(thumbnailId, thumbnailType, folderId) ?? false

            if (!thumbnailExported || force) {
              const exists = fileExists(thumbnailFilePath)
              if (!exists || force) {
                await renderStill({
                  composition: inputComposition,
                  serveUrl: bundled,
                  frame: composition.durationInFrames - 1,
                  output: thumbnailFilePath,
                  inputProps: inputProps,
                })
              }

              upload(thumbnailId, thumbnailFilePath, thumbnailType, folderId)

              if (updateSessionThumbnails) {
                const copyPath = join(publicEventFolder, thumbnailId)
                copyFileSync(thumbnailFilePath, copyPath)

                // update session file 
                const sessionFilePath = join(dataSessionFolder, `${session.id}.json`)
                if (existsSync(sessionFilePath)) {
                  const sessionFile = JSON.parse(readFileSync(sessionFilePath, 'utf8'))
                  writeFileSync(sessionFilePath, JSON.stringify({
                    ...sessionFile,
                    coverImage: `/sessions/${event.id}/${thumbnailId}`
                  }, null, 2))
                }
              }
            }
          }
        }

        // lastProgressPrinted = -1
      }
    } catch (err) {
      console.log('Error rendering session', err)
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
  if (CONFIG.GOOGLE_DRIVE_ID && uploadGoogledrive) {
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
