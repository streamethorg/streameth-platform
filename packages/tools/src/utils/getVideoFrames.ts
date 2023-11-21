import ffmpeg from 'fluent-ffmpeg'
import { CalculateMetadataFunction } from 'remotion'
import { IEvent, ISession } from './types'

const updateSessionThumbnails = true
const force = process.argv.slice(2).includes('--force')
const local = process.argv.slice(2).includes('--local')
const processArgs = process.argv
  .slice(2)
  .filter((i) => !i.startsWith('--'))
const apiBaseUri = local
  ? 'http://localhost:3000/api'
  : 'https://app.streameth.org/api'

type Props = {
  event: IEvent
  videoPath: string
  durationInSeconds: number
}

const getVideoFrames = (videoPath: string) => {
  ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err) {
      console.error('Error: ', err)
      return -1
    }

    const videoStream = metadata.streams.find(
      (s) => s.codec_type === 'video'
    )

    if (videoStream && videoStream.nb_frames) {
      console.log(`Total frames in video: ${videoStream.nb_frames}`)

      return videoStream.nb_frames
    }
  })
  console.error('Could not determine the number of frames.')
  return -1
}

function downloadVideo(url: string, output: string): void {
  ffmpeg(url)
    .output(`tmp/videos/${output}`)
    .on('end', () => {
      console.log(`Video downloaded and saved as ${output}`)
    })
    .on('error', (err) => {
      console.error('Error:', err)
    })
    .run()
}

const calculateSessionMetadata: CalculateMetadataFunction<
  Props
> = async ({ props }) => {
  console.log('Fetch event sessions..')
  const res = await fetch(
    `${apiBaseUri}/organizations/${props.event.organizationId}/events/${props.event.id}/sessions`
  )
  const sessions = await res.json()
  if (sessions.length === 0) {
    console.log('No sessions found. Skip rendering')
    return {
      durationInFrames: 250,
      fps: 25
    }
  }
  sessions.map((session: ISession) => {
    downloadVideo(
      `https://lp-playback.com/hls/${session.playbackId}/1080p0.mp4`,
      session.id
    )
  })

  const framePromises = sessions.map((session: ISession) => 
    getVideoFrames(`tmp/videos/${session.id}`));

  try {
    const frameCounts = await Promise.all(framePromises);
    const totalFrames = frameCounts.reduce((acc, frames) => acc + frames, 0);

    const durationInSeconds = totalFrames / 25;
    props.durationInSeconds = durationInSeconds;

    return {
      durationInFrames: totalFrames,
      fps: 25,
    };
  } catch (error) {
    console.error('Error calculating total frames:', error);
    return {
      durationInFrames: 250,
      fps: 25
    }
  }
};

export default calculateSessionMetadata;
