import { Sequence, AbsoluteFill, staticFile, Audio, useVideoConfig, useCurrentFrame, interpolate, Img, OffthreadVideo, Freeze } from 'remotion'
import { loadFont } from "@remotion/google-fonts/SofiaSansExtraCondensed"
import { G_FPS } from '../../consts'
import dayjs from 'dayjs'

const { fontFamily } = loadFont()

interface SpeakerProps {
    id: string
    name: string
    photo: string
}

interface SessionProps {
    name: string
    start: number,
    end: number,
    speakers: SpeakerProps[],
}

type Props = {
    type: string,
    session: SessionProps
}

export const DevconnectISTStill: React.FC<Props> = ({ type, session }) => {
    return (
        <Freeze frame={200}>
            <DevconnectIST type={type} session={session} />
        </Freeze>
    )
}

export const DevconnectIST: React.FC<Props> = ({ type, session }) => {
    const { durationInFrames } = useVideoConfig()
    const frame = useCurrentFrame()

    const audioFile = staticFile('devconnect/audio/IST-material-sound.mp3')
    const introFile = staticFile(`devconnect/intro/IST-intro-${type}.mp4`)
    const bgFile = staticFile(`devconnect/images/IST-bg-${type}.png`)
    const logoFile = staticFile(`devconnect/logos/EVM-Summit.png`)

    const introTime = 5 * G_FPS
    const sessionTime = 7 * G_FPS
    const fadeTime = introTime + (G_FPS / 2)

    const logoMove = interpolate(frame, [introTime, fadeTime], [-60, 0], { extrapolateRight: "clamp" });
    const initialOpacity = interpolate(frame, [introTime, fadeTime], [0, 1]);
    const delayedOpacity = interpolate(frame, [introTime + 15, fadeTime + 15], [0, 1]);

    function titleClassName() {
        console.log('title length #', session.name.length)
        let className = 'w-full text-center font-bold text-[#252e3d] leading-snug'
        if (session.name.length >= 140) className += ' text-7xl'
        if (session.name.length > 60 && session.name.length < 140) className += ' text-8xl'
        if (session.name.length > 40 && session.name.length < 60) className += ' text-8xl'
        if (session.name.length < 40) className += ' text-[9rem]'

        return className
    }

    function speakersClassName() {
        console.log('# of speakers', session.speakers.length)
        let className = 'flex flex-row'
        if (session.speakers.length >= 7) className += ' gap-8'
        if (session.speakers.length > 3 && session.speakers.length < 7) className += ' gap-16'
        if (session.speakers.length <= 3) className += ' gap-24'

        return className
    }

    return (
        <AbsoluteFill>
            <Audio src={audioFile} />
            <AbsoluteFill>
                <Img style={{ width: "100%" }} src={bgFile} />
            </AbsoluteFill>

            <AbsoluteFill>
                <Sequence name='Intro video' from={0} durationInFrames={durationInFrames} layout="none">
                    <OffthreadVideo muted src={introFile} />
                </Sequence>
            </AbsoluteFill>

            <AbsoluteFill>
                <div className='flex py-12 px-24 flex-col w-full space-between justify-between'>
                    <div className='flex relative h-32' style={{ opacity: initialOpacity }}>
                        <Sequence name='Logo' from={introTime} durationInFrames={sessionTime} layout="none">
                            <div className='absolute -top-12' style={{ left: logoMove, opacity: initialOpacity }}>
                                <Img className='h-60' src={logoFile} />
                            </div>
                        </Sequence>
                        <Sequence name='Datetime' from={introTime} durationInFrames={sessionTime} layout="none">
                            <div className='absolute right-0 flex flex-col text-right text-4xl gap-4'>
                                <span>{dayjs(session.start).format('MMMM DD, YYYY')}</span>
                                <span>Istanbul, Turkey</span>
                            </div>
                        </Sequence>
                    </div>
                    <div className='flex relative mt-12 h-96 items-center' style={{ opacity: delayedOpacity }}>
                        <Sequence name='Title' from={introTime + 10} durationInFrames={sessionTime} layout="none">
                            <h1 className={titleClassName()} style={{ fontFamily }}>{session.name}</h1>
                        </Sequence>
                    </div>
                    <div className='flex relative' style={{ opacity: delayedOpacity }}>
                        <Sequence name='Speakers' from={introTime + 10} durationInFrames={sessionTime} layout="none">
                            <div className='flex w-full justify-center items-center'>
                                <div className={speakersClassName()}>
                                    {session.speakers.map((i) => {
                                        return (
                                            <div key={i.id} className='flex flex-col items-center gap-8'>
                                                <Img className='w-48 h-48 object-cover rounded-full' src={i.photo} />
                                                <span className='text-3xl w-48 text-center leading-relaxed'>{i.name}</span>
                                            </div>)
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
