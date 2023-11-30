import { join } from 'path'
import { CONFIG } from 'utils/config'
import { GetData } from 'utils/fs'
import { uploadAsset } from 'utils/livepeer'

Run()

async function Run() {
  // TODO: Refactor to use the server / SessionController
  const files = GetData(join(CONFIG.DATA_FOLDER, 'sessions'))
  const filesToProcess = files.filter((file) => file.source && !file.videoUrl)

  console.log('Upload files', filesToProcess.length)
  for (let i = 0; i < filesToProcess.length; i++) {
    const session = filesToProcess[i]
    await uploadAsset(session, join(CONFIG.ASSET_FOLDER, 'sessions', `${session.id}.mp4`))
  }
}
