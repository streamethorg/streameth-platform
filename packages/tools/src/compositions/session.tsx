import { Sequence, AbsoluteFill, staticFile, Video, Audio, useVideoConfig, useCurrentFrame, interpolate } from 'remotion'
import { ISession as SessionType, ISpeaker as SpeakerType } from '../types'
import { G_AUDIO_PATH, G_ANIMATION_PATH, G_DURATION } from '../consts'
import Text from '../components/Text'
import { splitTextIntoString } from '../utils/stringManipulation'
import { Rect } from '@remotion/shapes'

interface Props {
  readonly session: SessionType
}

function clampInterpolation(f: number, start: number[], end: number[]): number {
  return interpolate(f, start, end, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export default function Session() {
  const { session } = props
  const { durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()
  const startFadeFrame = durationInFrames - 50

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
      <Sequence durationInFrames={G_DURATION}>
        <Video muted style={{ opacity: videoOpacity }} src={staticFile(G_ANIMATION_PATH)} />
      </Sequence>
      {session.speakers!.map((speaker: SpeakerType, index: number) => (
        <Sequence name="Name(s)" durationInFrames={G_DURATION}>
          <div style={{ opacity: videoOpacity }}>
            <Text text={speaker.name} x={775} y={335 - index * 80} opacity={showText(frame)} fontWeight={800} fontSize={65} />
          </div>
        </Sequence>
      ))}
      <Sequence name="Title" durationInFrames={G_DURATION}>
        <div className="leading-tight" style={{ opacity: videoOpacity }}>
          <Text text={splitTextIntoString(session.name, 30)} x={775} y={493} opacity={showText(frame)} fontWeight={600} />
        </div>
      </Sequence>
      <Sequence durationInFrames={G_DURATION}>
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
        src={staticFile(G_AUDIO_PATH)}
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
