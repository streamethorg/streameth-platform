import {
  AbsoluteFill,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  OffthreadVideo,
} from 'remotion'
import {
  DevconnectIntroDuration,
  DevconnectOutroDuration,
} from './index'
import { Intro, SessionProps } from './intro'
import { linearTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'

export type Props = {
  id: string
  type: string
  eventId: string
  videoUrl: string
  videoDuration: number
  session: SessionProps
}

export const Join: React.FC<Props> = ({
  id,
  type,
  eventId,
  videoUrl,
  videoDuration,
  session,
}) => {
  const outroFile = staticFile(
    `devconnect/outro/IST-outro-${type}.mp4`
  ) // 9 secs

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={DevconnectIntroDuration}>
          <Intro id={eventId} type={type} session={session} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        <TransitionSeries.Sequence durationInFrames={videoDuration}>
          <OffthreadVideo src={videoUrl} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        <TransitionSeries.Sequence
          durationInFrames={DevconnectOutroDuration}>
          <OffthreadVideo src={outroFile} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
