import { JoinSessions } from 'utils/ffmpeg'
import { join } from 'path'
import { CONFIG } from 'utils/config'
import { GetData } from 'utils/fs'

Run()

async function Run() {
  // TODO: Refactor to use the server / SessionController
  const files = GetData(join(CONFIG.DATA_FOLDER, 'sessions'))
  const filesToProcess = files.filter((file) => file.source && !file.videoUrl)
  
  await JoinSessions(filesToProcess.map((i) => i.id))
}
