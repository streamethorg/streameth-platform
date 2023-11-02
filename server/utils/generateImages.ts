import { extractFirstFrame } from './video'
import SessionController from '../controller/session'
import Session from '../model/session'
import fs from 'fs'

const eventId = 'zuconnect_istanbul__neurotech_track'

async function main() {
  const sessionController = new SessionController()
  const sessions = await sessionController.getAllSessions({
    eventId,
  })

  for (const session of sessions) {
    try {
      const dirPath = await Session.getSessionImageDirectory(eventId)
      const filePath = await Session.getSessionImagePath(
        eventId,
        session.id
      )

      if (!fs.existsSync(dirPath)) {
        console.log('Dir does not exists, creating it now.')
        fs.mkdirSync(dirPath, { recursive: true })
      }
      if (!session.videoUrl) {
        console.error('No video url found for session ' + session.id)
        continue
      }

      await extractFirstFrame(session.videoUrl, filePath)
    } catch (error) {
      console.log('error', session.videoUrl, error)
    }
  }
}

main()
