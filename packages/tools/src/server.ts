import express, { Request, Response } from 'express'
import fetch from 'cross-fetch'
import dotenv from 'dotenv'
import { JoinSessions, Split } from './utils/ffmpeg'

dotenv.config()

const app = express()
const port = process.env.PORT || 3030

app.get('/', async (req: Request, res: Response) => {
  res.send('Express Server ⚡️')
})

app.get('/process', async (req: Request, res: Response) => {
  const resp = await fetch('https://app.streameth.org/api/organizations/streameth/events/test_summit_2023/sessions')
  const sessions = await resp.json()
  const toProcess = sessions.filter((i: any) => i.source && !i.videoUrl)

  console.log('SESSIONS TO PROCESS', toProcess.length)

  await Split(
    toProcess.map((i: any) => {
      return {
        id: i.id,
        streamUrl: i.source.streamUrl,
        start: i.source.start,
        end: i.source.end,
      }
    })
  )

  await JoinSessions(toProcess.map((i: any) => i.id))

  res.send(`Sessions processed ${toProcess.length}`)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
