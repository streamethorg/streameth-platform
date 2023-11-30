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
import { ProgCryptoProps } from './intro'

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
  session: SessionProps
}

export const WideIntro: React.FC<
  Zod.infer<typeof ProgCryptoProps>
> = ({ session }) => {
  const { durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()

  const audioFile = staticFile('0xparc/audio/tails-of-love_faded.mp3')
  const introFile = staticFile(
    `0xparc/intro/IST_Progcrypto_Intro_Wide.webm`
  )
  const logoFile = ''

  const frameRate = 25
  const introTime = 3 * frameRate
  const sessionTime = 6 * frameRate
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
    [durationInFrames - 25, durationInFrames],
    [1, 0]
  )
  const translateYValue =
    frame >= durationInFrames - 25
      ? interpolate(
          frame,
          [durationInFrames - 25, durationInFrames],
          [280, 350]
        )
      : 280

  function titleClassName() {
    let className = 'w-full text-center'
    if (session.name.length >= 140)
      className += ' text-7xl leading-none'
    if (session.name.length > 60 && session.name.length < 140)
      className += ' text-7xl leading-tight'
    if (session.name.length > 40 && session.name.length < 60)
      className += ' text-8xl leading-tight'
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
        <Sequence
          name="Intro video"
          from={0}
          durationInFrames={durationInFrames}
          layout="none">
          <OffthreadVideo muted src={introFile} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        <div className="flex py-12 px-24 flex-col w-full space-between justify-between text-[#ED5F2B]">
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
              <div
                className={titleClassName()}
                style={{ fontFamily: 'Grotesk Trial Medium' }}>
                {session.name}
              </div>
            </Sequence>
          </div>
          <div
            className="flex relative mt-28"
            style={{
              opacity:
                frame < durationInFrames - 100
                  ? delayedOpacity
                  : endingOpactity,
              transform: `translateY(${translateYValue - 70}px)`,
            }}>
            <Sequence
              name="Speakers"
              from={introTime + 10}
              durationInFrames={sessionTime}
              layout="none">
              <div
                className="flex w-full justify-center items-center"
                style={{ fontFamily: 'Grotesk Trial Regular' }}>
                <div className={speakersClassName()}>
                  {session.speakers.map((i) => {
                    return (
                      <div
                        key={i.id}
                        className="flex flex-col items-center gap-4">
                        <Img
                          className="w-40 object-cover rounded-full border-black shadow-md"
                          src={i.photo ?? CreateAvatar(i.name)}
                        />
                        <span className="text-4xl w-48 text-center leading-normal border-black">
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
      <Audio src={audioFile} />
    </AbsoluteFill>
  )
}
