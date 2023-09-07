import fs from 'fs'
import concat from 'ffmpeg-concat'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { CONFIG } from './config'
import { createReadStream, existsSync, ReadStream } from 'fs'
import * as child from 'child_process'

export function ToStream(filepath: string) {
  return createReadStream(filepath, { encoding: 'utf8' })
}

export async function ToMp3(id: string, stream: ReadStream, bitrate = CONFIG.BITRATE) {
  console.log('Convert to mp3', id)

  try {
    ffmpeg(stream).audioBitrate(bitrate).format('mp3').save(`${CONFIG.ASSET_FOLDER}/mp3/${id}.mp3`).on('error', console.error)
  } catch (error) {
    console.log('Unable to convert to mp3', id, error)
  }
}

export async function ToMp4(id: string, stream: ReadStream) {
  console.log('Convert to mp4', id)

  try {
    ffmpeg(stream).format('mp4').save(`${CONFIG.ASSET_FOLDER}/mp4/${id}.mp4`).on('error', console.error)
  } catch (error) {
    console.log('Unable to convert to mp3', id, error)
  }
}

export async function JoinSessions(sessions: string[]) {
  console.log('Join', sessions.length, 'sessions')

  for (let i = 0; i < sessions.length; i++) {
    const id = sessions[i]
    const inputs = []
    if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/intros/${id}.mp4`)) {
      inputs.push(`${CONFIG.ASSET_FOLDER}/intros/${id}.mp4`)
    }
    if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`)) {
      inputs.push(`${CONFIG.ASSET_FOLDER}/splits/${id}.mp4`)
    }
    if (fs.existsSync(`${CONFIG.ASSET_FOLDER}/outros/${id}.mp4`)) {
      inputs.push(`${CONFIG.ASSET_FOLDER}/outros/${id}.mp4`)
    }

    if (inputs.length === 0) {
      console.log('No inputs for', id)
      continue
    }

    await Join(inputs, `${CONFIG.ASSET_FOLDER}/sessions/${id}.mp4`)
  }
}

export async function Join(inputs: string[], output: string) {
  console.log('Join', inputs.length, 'videos to', output)

  if (fs.existsSync(output)) {
    console.log('File already exists', output)
    return
  }

  await concat({
    output: output,
    videos: inputs,
    transition: {
      name: 'fade', // Options: fade, directionalwipe, circleopen, squareswire
      duration: 750,
    },
  })
}

export async function Split(sessions: { id: string; streamUrl: string; start: number; end: number }[]) {
  console.log('Splitting to', sessions.length, 'videos')

  for (const session of sessions) {
    const file = `${CONFIG.ASSET_FOLDER}/splits/${session.id}.mp4`
    console.log('Split to', session.id, session.start, session.end)

    if (existsSync(file)) {
      console.log('File already exists', file)
      continue
    }

    // To fix Segmentation fault (core dumped), install nscd
    // `sudo apt install nscd`
    child.execSync(`${ffmpegPath ?? 'ffmpeg'} -i ${session.streamUrl} -ss 10 -to 30 -c:v libx264 -c:a copy -y ${file}`, {
      stdio: 'inherit',
    })

    if (existsSync(file)) {
      console.log('Successfully split', session.id, 'at', file)
    }
  }
}
