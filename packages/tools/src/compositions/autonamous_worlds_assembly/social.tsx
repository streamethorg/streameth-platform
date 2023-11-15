import { AbsoluteFill, staticFile, Img } from 'remotion'
import { Props } from './intro'
import dayjs from 'dayjs'

export const Social: React.FC<Props> = ({ session }) => {
  const bgFile = staticFile(`0xparc/images/AWA_still.png`)
  const logoFile = ''

  function titleClassName() {
    let className = 'w-full text-center'
    if (session.name.length >= 140) className += ' text-2xl none'
    if (session.name.length >= 60 && session.name.length < 140)
      className += ' text-3xl leading-tight'
    if (session.name.length >= 40 && session.name.length < 60)
      className += ' text-4xl leading-tight'
    if (session.name.length < 40) className += ' text-5xl'

    return className
  }

  function speakersClassName() {
    let className = 'flex flex-row'
    if (session.speakers.length >= 7) className += ' gap-4'
    if (session.speakers.length > 3 && session.speakers.length < 7)
      className += ' gap-8'
    if (session.speakers.length <= 3) className += ' gap-8'

    return className
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <Img style={{ width: '100%' }} src={bgFile} />
      </AbsoluteFill>

      <AbsoluteFill>
        <div className="flex py-6 px-12 flex-col w-full space-between justify-between text-white">
          <div className="flex relative h-32">
            {logoFile && (
              <div className="absolute -top-4">
                <Img className="h-32 mt-4" src={logoFile} />
              </div>
            )}
          </div>
          <div className="flex relative mt-16 h-32 items-end">
            <h1
              className={titleClassName()}
              style={{
                transform: `translateY(130px)`,
                fontFamily: 'FK Raster Grotesk',
              }}>
              {session.name}
            </h1>
          </div>
          <div className="flex relative mt-16">
            <div className="flex w-full justify-center items-center">
              <div className={speakersClassName()}>
                {session.speakers.map((i) => {
                  return (
                    <div
                      key={i.id}
                      className="flex flex-col items-center gap-4"
                      style={{
                        transform: `translateY(90px)`,
                        fontFamily: 'FK Raster Grotesk',
                      }}>
                      <span className="text-xl font-medium w-32 text-center leading-normal">
                        {i.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
