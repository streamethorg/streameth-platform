import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  staticFile,
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
  const introFile = staticFile(`secureum${video.coverImage}`)
  const videoFile = staticFile(`secureum/videos/${id}.mp4`)
  const music = staticFile('secureum/disco.wav')

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
          durationInFrames={video.durationInFrames}>
          <OffthreadVideo src={videoFile} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio src={music} />
    </AbsoluteFill>
  )
}
