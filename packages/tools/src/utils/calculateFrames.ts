import ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import * as path from 'path'

export const calculateFrames = (
  videoPath: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('Error: ', err)
        reject(0)
      }

      const videoStream = metadata.streams.find(
        (s: any) => s.codec_type === 'video'
      )

      if (videoStream && videoStream.nb_frames) {
        console.log(`Total frames in video: ${videoStream.nb_frames}`)
        resolve(Number(videoStream.nb_frames))
      } else {
        reject(0)
      }
    })
  })
}
