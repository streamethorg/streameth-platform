import { AbsoluteFill, staticFile, Img } from 'remotion'
import { Props } from './intro'
import dayjs from 'dayjs'
import { CreateAvatar } from '../../utils/avatars'

export const Social: React.FC<Props> = ({ type, session, id }) => {
    const bgFile = staticFile(`devconnect/images/IST-bg-${type}.png`)
    const bgLogoFile = staticFile(`devconnect/images/IST-eth-logo.png`)
    const logoFile = id ? staticFile(`devconnect/logos/${id}.png`) : ''

    function titleClassName() {
        let className = 'w-full text-center'
        if (session.name.length >= 140) className += ' text-6xl leading-none'
        if (session.name.length >= 60 && session.name.length < 140) className += ' text-7xl leading-tight'
        if (session.name.length >= 40 && session.name.length < 60) className += ' text-7xl leading-tight'
        if (session.name.length < 40) className += ' text-8xl'

        return className
    }

    function speakersClassName() {
        let className = 'flex flex-row'
        if (session.speakers.length >= 7) className += ' gap-4'
        if (session.speakers.length > 3 && session.speakers.length < 7) className += ' gap-8'
        if (session.speakers.length <= 3) className += ' gap-8'

        return className
    }

    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <Img style={{ width: "100%" }} src={bgFile} />
            </AbsoluteFill>

            <AbsoluteFill>
                <Img style={{ width: "100%" }} src={bgLogoFile} />
            </AbsoluteFill>

            <AbsoluteFill>
                <div className='flex py-6 px-12 flex-col w-full space-between justify-between text-[#252e3d]'>
                    <div className='flex relative h-32'>
                        {logoFile && (
                            <div className='absolute -top-4'>
                                <Img className='h-32 mt-4' src={logoFile} />
                            </div>
                        )}
                        <div className='absolute top-8 right-0 flex flex-col text-right text-2xl gap-4'>
                            <span>
                                {session.start && dayjs(session.start).format('MMMM DD, YYYY')}
                                {!session.start && <>Devconnect</>}
                            </span>
                            <span>Istanbul, Turkey</span>
                        </div>
                    </div>
                    <div className='flex relative mt-16 h-32 items-end'>
                        <h1 className={titleClassName()} style={{ fontFamily: 'Sofia Sans Extra Condensed' }}>{session.name}</h1>
                    </div>
                    <div className='flex relative mt-16'>
                        <div className='flex w-full justify-center items-center'>
                            <div className={speakersClassName()}>
                                {session.speakers.map((i) => {
                                    return (
                                        <div key={i.id} className='flex flex-col items-center gap-4'>
                                            <Img className='w-24 h-24 object-cover rounded-full' src={i.photo ?? CreateAvatar(i.name)} />
                                            <span className='text-xl font-medium w-32 text-center leading-normal'>{i.name}</span>
                                        </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    )
}
