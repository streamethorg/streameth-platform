import {
  Sequence,
  AbsoluteFill,
  staticFile,
  Audio,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Img,
  OffthreadVideo,
} from 'remotion'
import { CreateAvatar } from '../../utils/avatars'
import dayjs from 'dayjs'

export interface SpeakerProps {
  id: string
  name: string
  photo?: string
}

export interface SessionProps {
  name: string
  start: number
  end: number
  speakers: SpeakerProps[]
}

export type Props = {
  type: string
  session: SessionProps
  id: string
}

export const Intro: React.FC<Props> = ({ type, session, id }) => {
  const { durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()

  const audioFile = staticFile('0xparc/audio/IST_material-sound.mp3')
  const introFile = staticFile(`0xparc/intro/IST_AWA_Intro.mp4`)
  const bgFile = staticFile(`0xparc/images/AWA_still.png`)
  const logoFile = ''

  const frameRate = 25
  const introTime = 4 * frameRate
  const sessionTime = 9 * frameRate
  const fadeTime = introTime + frameRate / 2

  const logoMove = interpolate(
    frame,
    [introTime, fadeTime],
    [-60, 0],
    { extrapolateRight: 'clamp' }
  )
  const initialOpacity = interpolate(
    frame,
    [introTime, fadeTime],
    [0, 1]
  )
  const delayedOpacity = interpolate(
    frame,
    [introTime + 15, fadeTime + 15],
    [0, 1]
  )
  const endingOpactity = interpolate(
    frame,
    [durationInFrames - 50, durationInFrames - 20],
    [1, 0]
  )
  const translateYValue =
    frame >= durationInFrames - 40
      ? interpolate(
          frame,
          [durationInFrames - 40, durationInFrames],
          [150, 350]
        )
      : 150

  function titleClassName() {
    let className = 'w-full text-center'
    if (session.name.length >= 140)
      className += ' text-8xl leading-none'
    if (session.name.length > 60 && session.name.length < 140)
      className += ' text-8xl leading-tight'
    if (session.name.length > 40 && session.name.length < 60)
      className += ' text-9xl leading-tight'
    if (session.name.length < 40)
      className += ' text-9xl leading-tight'

    return className
  }

  function speakersClassName() {
    let className = 'flex flex-row'
    if (session.speakers.length >= 7) className += ' gap-8'
    if (session.speakers.length > 3 && session.speakers.length < 7)
      className += ' gap-16'
    if (session.speakers.length <= 3) className += ' gap-24'

    return className
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <Img style={{ width: '100%' }} src={bgFile} />
      </AbsoluteFill>

      <AbsoluteFill>
        <Sequence
          name="Intro video"
          from={0}
          durationInFrames={durationInFrames}
          layout="none">
          <OffthreadVideo muted src={introFile} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        <div className="flex py-12 px-24 flex-col w-full space-between justify-between text-white">
          <div
            className="flex relative h-32"
            style={{ opacity: initialOpacity }}>
            {logoFile && (
              <Sequence
                name="Logo"
                from={introTime}
                durationInFrames={sessionTime}
                layout="none">
                <div
                  className="absolute -top-4"
                  style={{ left: logoMove, opacity: 0 }}>
                  <Img className="h-60" src={logoFile} />
                </div>
              </Sequence>
            )}
          </div>
          <div
            className="flex relative mt-8 h-96 items-end"
            style={{
              opacity:
                frame < durationInFrames - 100
                  ? delayedOpacity
                  : endingOpactity,
              transform: `translateY(${translateYValue}px)`,
            }}>
            <Sequence
              name="Title"
              from={introTime + 10}
              durationInFrames={sessionTime}
              layout="none">
              <h1
                className={titleClassName()}
                style={{ fontFamily: 'Grotesk Compact Smooth' }}>
                {session.name}
              </h1>
            </Sequence>
          </div>
          <div
            className="flex relative mt-28"
            style={{
              opacity:
                frame < durationInFrames - 100
                  ? delayedOpacity
                  : endingOpactity,
              transform: `translateY(${translateYValue - 100}px)`,
            }}>
            <Sequence
              name="Speakers"
              from={introTime + 10}
              durationInFrames={sessionTime}
              layout="none">
              <div className="flex w-full justify-center items-center">
                <div className={speakersClassName()}>
                  {session.speakers.map((i) => {
                    return (
                      <div
                        key={i.id}
                        className="flex flex-col items-center gap-4">
                        <span className="text-3xl w-48 text-center leading-normal">
                          {i.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Sequence>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
