import * as fs from 'fs'
import * as path from 'path'
import { calculateFrames } from '../utils/calculateFrames'

const updateJsonWithFrames = async (
  jsonFilePath: string,
  videoFolderPath: string
) => {
  try {
    const jsonContent = JSON.parse(
      fs.readFileSync(jsonFilePath, 'utf8')
    )

    for (const session of jsonContent) {
      if (session.playbackId) {
        const videoPath = path.join(
          videoFolderPath,
          `${session.playbackId}.mp4`
        )
        if (fs.existsSync(videoPath)) {
          const frameCount = await calculateFrames(videoPath)
          session['frameCount'] = frameCount
        }
      }
    }

    fs.writeFileSync(
      jsonFilePath,
      JSON.stringify(jsonContent, null, 2)
    )
    console.log('JSON file updated successfully.')
  } catch (error) {
    console.error('Error updating JSON file:', error)
  }
}

const jsonFilePath = path.join('public/json/secureum_trustx.json')
const videoFolderPath = path.join('public/secureum/videos/')
updateJsonWithFrames(jsonFilePath, videoFolderPath)
