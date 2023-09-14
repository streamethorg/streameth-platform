import { JoinSessions, Split } from 'utils/ffmpeg'
import { join } from 'path'
import { CONFIG } from 'utils/config'
import { GetData } from 'utils/fs'
import { uploadAsset } from 'utils/livepeer'
// Process function runs all scripts at once
// Split from Livestream => Join with intro/outro => Upload to Livepeer/IPFS

Run()

async function Run() {
  // TODO: Refactor to use the server / SessionController
  const files = GetData(join(CONFIG.DATA_FOLDER, 'sessions'))
  const filesToProcess = files.filter((file) => file.source && !file.videoUrl && !file.playback?.videoUrl)
  console.log(filesToProcess)

  await Split(
    filesToProcess.map((i) => {
      return {
        id: i.id,
        streamUrl: "https://lp-playback.com/hls/a2ae5cylmxs38npg/1080p0.mp4",
        start: i.source.start,
        end: i.source.end,
      }
    })
  )

  await new Promise((r) => setTimeout(r, 1000))

  const filesToProcessArray = filesToProcess.map((i) => i.id)
  await JoinSessions(filesToProcessArray)

  await new Promise((r) => setTimeout(r, 1000))

  for (let i = 0; i < filesToProcess.length; i++) {
    const session = filesToProcess[i]
    await uploadAsset(session, join(CONFIG.ASSET_FOLDER, 'sessions', `${session.id}.mp4`))
  }
}
