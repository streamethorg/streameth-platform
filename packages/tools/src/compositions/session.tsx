import { Sequence, AbsoluteFill, staticFile, Video, Audio, useVideoConfig, useCurrentFrame, interpolate } from 'remotion'
import { ISession as SessionType, ISpeaker as SpeakerType } from '../types'
import { G_AUDIO_PATH, G_ANIMATION_PATH, G_DURATION } from '../consts'
import Text from '../components/Text'
import { splitTextIntoString } from '../utils/stringManipulation'

function clampInterpolation(f: number, start: number[], end: number[]): number {
  return interpolate(f, start, end, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export default function Session({ session }: { session: SessionType }) {
  const { durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()
  const startFadeFrame = durationInFrames - 50

  const opacity = clampInterpolation(frame, [startFadeFrame, durationInFrames], [0, 1])

  const computeOpacity = (f: any) => {
    return interpolate(f, [G_DURATION - 15, G_DURATION], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const showText = (f: any) => {
    return interpolate(f, [110, 120], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const allSpeakerNames = session.speakers!.map((speaker) => speaker.name).join('\n')

  const videoOpacity = computeOpacity(frame)

  return (
    <>
      <Sequence durationInFrames={G_DURATION}>
        <Video muted style={{ opacity: videoOpacity }} src={staticFile(G_ANIMATION_PATH)} />
      </Sequence>
      <Sequence name="Name(s)" durationInFrames={G_DURATION}>
        <div
          style={{
            width: '100%',
            opacity: videoOpacity,
          }}>
          <Text text={allSpeakerNames} x={0} y={session.name.length < 50 ? 550 : 650} color="white" fontSize={60} opacity={showText(frame)} />
        </div>
      </Sequence>
      <Sequence name="Title" durationInFrames={G_DURATION}>
        <div
          style={{
            width: '100%',
            opacity: videoOpacity,
          }}>
          <Text text={splitTextIntoString(session.name, 50)} x={0} y={450} color="white" opacity={showText(frame)} fontSize={70} fontWeight={200} />
        </div>
      </Sequence>
      <Audio
        src={staticFile(G_AUDIO_PATH)}
        endAt={G_DURATION}
        volume={(f) =>
          f < G_DURATION - 75
            ? interpolate(f, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : interpolate(f, [G_DURATION - 75, G_DURATION], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
        }
      />
      <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
    </>
  )
}
