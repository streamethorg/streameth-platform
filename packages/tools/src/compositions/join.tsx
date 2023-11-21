import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion'
import { linearTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'

interface Video {
  durationInFrames: number
}

export type Props = {
  id: string
  coverImage: string
  transitionDuration?: number
}

export const JoinVideos: React.FC<Props> = ({
  id,
  coverImage,
  transitionDuration,
}) => {
  const duration = transitionDuration || 25 // 1 sec
  const { durationInFrames } = useVideoConfig()
  const introFile = staticFile(`secureum${coverImage}`)
  const videoFile = staticFile(`secureum/videos/${id}.mp4`)
  const music = staticFile('secureum/disco.mp3')

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
          <OffthreadVideo src={videoFile} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio src={music} />
    </AbsoluteFill>
  )
}
