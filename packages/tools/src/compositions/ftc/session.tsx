import { Sequence, AbsoluteFill, staticFile, Video, Audio, useVideoConfig, useCurrentFrame, interpolate } from 'remotion'
import { ISession as SessionType, ISpeaker as SpeakerType } from '../../utils/types'
import { splitTextIntoString } from '../../utils/stringManipulation'
import { Rect } from '@remotion/shapes'
import Text from './components/Text'

export const FtcDuration = 170

export default function Ftc({ session }: { session: SessionType }) {
  const { durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()
  const startFadeFrame = durationInFrames - 50

  function clampInterpolation(f: number, start: number[], end: number[]): number {
    return interpolate(f, start, end, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const opacity = clampInterpolation(frame, [startFadeFrame, durationInFrames], [0, 1])
  const videoVolume = clampInterpolation(frame, [startFadeFrame, durationInFrames], [1, 0])

  const computeOpacity = (f: any) => {
    return interpolate(f, [135, 175], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const showText = (f: any) => {
    return interpolate(f, [15, 30], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const videoOpacity = computeOpacity(frame)

  return (
    <>
      <Sequence durationInFrames={FtcDuration}>
        <Video muted style={{ opacity: videoOpacity }} src={staticFile('/animations/FtC_animation.mp4')} />
      </Sequence>
      {session.speakers!.map((speaker: SpeakerType, index: number) => (
        <Sequence key={speaker.id} name="Name(s)" durationInFrames={FtcDuration}>
          <div style={{ opacity: videoOpacity }}>
            <Text text={speaker.name} x={775} y={335 - index * 80} opacity={showText(frame)} fontWeight={800} fontSize={65} />
          </div>
        </Sequence>
      ))}
      <Sequence name="Title" durationInFrames={FtcDuration}>
        <div className="leading-tight" style={{ opacity: videoOpacity }}>
          <Text text={splitTextIntoString(session.name, 30)} x={775} y={493} opacity={showText(frame)} fontWeight={600} />
        </div>
      </Sequence>
      <Sequence durationInFrames={FtcDuration}>
        <div style={{ opacity: videoOpacity }}>
          <Rect
            width={770}
            height={3}
            fill="black"
            style={{
              opacity: showText(frame),
              transform: 'translateX(760px) translateY(450px)',
            }}
          />
        </div>
      </Sequence>
      <Audio
        src={staticFile('/audio/522_short1_cream-soda-day_0018.wav')}
        endAt={150}
        volume={(f) =>
          f < 115
            ? interpolate(f, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            : interpolate(f, [115, 150], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
        }
      />
      <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
    </>
  )
}
