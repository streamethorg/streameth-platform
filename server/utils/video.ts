import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import fs from 'fs'

export async function extractFirstFrame(hlsUrl: string, filePath: string) {
  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log('File already exists, skipping frame extraction.')
    return
  }

  ffmpeg(hlsUrl)
    .screenshots({
      timemarks: ['00:00:07.500'],
      filename: filePath,
      folder: '.',
      size: '1920x1080',
    })
    .on('end', function () {
      console.log('Screenshots taken')
    })
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message)
    })
    .on('stderr', function (stderrLine) {
      console.log('Stderr: ' + stderrLine)
    })
}
