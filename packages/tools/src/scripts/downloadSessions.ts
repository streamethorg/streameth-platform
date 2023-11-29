import fs from 'fs'
import https from 'https'
import path from 'path'
import process from 'process'
import { ISession } from 'utils/types'

async function downloadFile(
  url: string,
  dest: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {}) // Delete the file async. (No need to wait for the callback)
        reject(err)
      })
  })
}

async function processFiles(
  sourceDir: string,
  targetDir: string
): Promise<void> {
  const files = fs.readdirSync(sourceDir)
  for (const file of files) {
    if (path.extname(file) === '.json') {
      const content = fs.readFileSync(
        path.join(sourceDir, file),
        'utf-8'
      )
      const json: ISession = JSON.parse(content)
      if (json.playbackId) {
        const videoUrl = `https://lp-playback.com/hls/${json.playbackId}/1080p0.mp4`
        const destPath = path.join(targetDir, `${json.id}.mp4`)
        console.log(`Downloading ${json.id}`)
        await downloadFile(videoUrl, destPath)
        console.log(`Downloaded video for playbackId: ${json.id}`)
      }
    }
  }
}

async function start(args: string[]): Promise<void> {
  if (args.length !== 4) {
    // args also includes node and script path, so we need 4 elements.
    throw new Error(
      'Incorrect arguments. Usage: node script.js <source_directory> <target_directory>'
    )
  }
  const sourceDir = args[2]
  const targetDir = args[3]

  await processFiles(sourceDir, targetDir)
}

start(process.argv)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
