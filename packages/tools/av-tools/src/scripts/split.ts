import { join } from 'path'
import { CONFIG } from 'utils/config'
import { Split } from 'utils/ffmpeg'
import { GetData } from 'utils/fs'

Run()

async function Run() {
  // TODO: Refactor to use the server / SessionController
  const files = GetData(join(CONFIG.DATA_FOLDER, 'sessions'))
  const filesToProcess = files.filter((file) => file.source && !file.videoUrl)

  await Split(
    filesToProcess.map((i) => {
      return {
        id: i.id,
        streamUrl: i.source.streamUrl,
        start: i.source.start,
        end: i.source.end,
      }
    })
  )
}
