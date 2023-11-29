import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
  Video,
} from 'remotion'
import { linearTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'

export type VideoProps = {
  id: string
  eventName: string
  transitionDuration?: number
}

export const JoinVideos: React.FC<VideoProps> = ({
  id,
  eventName,
  transitionDuration,
}) => {
  const duration = transitionDuration || 25 // 1 sec
  const { durationInFrames } = useVideoConfig()
  const introFile = staticFile(`${eventName}/images/${id}.jpg`)
  const videoFile = staticFile(`${eventName}/videos/${id}.mp4`)
  const music = staticFile(`${eventName}/disco.mp3`)

  return (
    <AbsoluteFill color="black">
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <Img src={introFile} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: duration })}
        />
        <TransitionSeries.Sequence
          durationInFrames={durationInFrames}>
          <Video src={videoFile} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio src={music} />
    </AbsoluteFill>
  )
}
