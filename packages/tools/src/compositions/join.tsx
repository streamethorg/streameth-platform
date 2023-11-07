import { AbsoluteFill, OffthreadVideo } from 'remotion'
import { linearTiming, TransitionSeries } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"
import { Fragment } from 'react'

interface Video {
  pathOrUrl: string
  duration: number
}

export type Props = {
  videos: Video[]
  transitionDuration?: number
}

export const JoinVideos: React.FC<Props> = ({ videos, transitionDuration }) => {
  const duration = transitionDuration || 25 // 1 sec

  return (
    <AbsoluteFill color='black'>
      <TransitionSeries>
        {videos.map((video, index) => (
          <Fragment key="index">
            <TransitionSeries.Sequence durationInFrames={video.duration}>
              <OffthreadVideo src={video.pathOrUrl} />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: duration })} />
          </Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill >
  )
}
