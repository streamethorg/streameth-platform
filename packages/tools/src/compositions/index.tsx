import {
  Composition,
  Folder,
  Still,
  continueRender,
  delayRender,
  staticFile,
} from 'remotion'
import { MOCK_SESSION } from '../utils/mocks'
import { Fragment } from 'react'
import {
  DevconnectEvents,
  DevconnectFrameRate,
  DevconnectIntroDuration,
  DevconnectOutroDuration,
} from './devconnect'
import { DevconnectISTProps, Intro } from './devconnect/intro'
import { Social } from './devconnect/social'
import {
  Intro as ProgCryptoIntro,
  ProgCryptoProps,
} from './progcrypto/intro'
import { WideIntro as ProgCryptoWideIntro } from './progcrypto/intro_wide'
import { Social as ProgCryptoSocial } from './progcrypto/social'
import { Intro as AwaIntro } from './autonamous_worlds_assembly/intro'
import { Social as AwaSocial } from './autonamous_worlds_assembly/social'
import { JoinVideos } from './join'
import calculateSessionMetadata from 'utils/getVideoFrames'
import { SessionSchema } from '../utils/mocks'
import { ISession as SessionType } from 'utils/types'

import SESSIONS from '../../public/json/secureum_trustx.json'
import { calculateFrames } from '../utils/calculateFrames'

const sessions: any[] = SESSIONS

export function Compositions() {
  const waitForFont = delayRender()
  const devconnectFont = new FontFace(
    `Sofia Sans Extra Condensed`,
    `url('${staticFile(
      'devconnect/fonts/SofiaSansExtraCondensed-Medium.ttf'
    )}') format('truetype')`
  )
  const progCryptoFont_Med = new FontFace(
    `Grotesk Trial Medium`,
    `url('${staticFile(
      '0xparc/fonts/FKGroteskTrial-Medium.otf'
    )}') format('opentype')`
  )
  const progCryptoFont_Reg = new FontFace(
    `Grotesk Trial Regular`,
    `url('${staticFile(
      '0xparc/fonts/FKGroteskTrial-Regular.otf'
    )}') format('opentype')`
  )

  const autonomousWorldsAssemblyFont = new FontFace(
    `FK Raster Grotesk`,
    `url('${staticFile(
      '0xparc/fonts/FKRasterGroteskCompact-Smooth.ttf'
    )}') format('truetype')`
  )

  devconnectFont
    .load()
    .then(() => {
      document.fonts.add(devconnectFont)
      continueRender(waitForFont)
    })
    .catch((err) => console.log('Error loading Devconnect font', err))

  progCryptoFont_Med
    .load()
    .then(() => {
      document.fonts.add(progCryptoFont_Med)
      continueRender(waitForFont)
    })
    .catch((err) =>
      console.log('Error loading progCryptoFont_Med font', err)
    )

  progCryptoFont_Reg
    .load()
    .then(() => {
      document.fonts.add(progCryptoFont_Reg)
      continueRender(waitForFont)
    })
    .catch((err) =>
      console.log('Error loading progCryptoFont_Reg font', err)
    )

  autonomousWorldsAssemblyFont
    .load()
    .then(() => {
      document.fonts.add(autonomousWorldsAssemblyFont)
      continueRender(waitForFont)
    })
    .catch((err) =>
      console.log(
        'Error loading autonomousWorldsAssemblyFont font',
        err
      )
    )

  return (
    <>
      <Folder name="Devconnect">
        <Composition
          id="custom-render"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectIntroDuration}
          fps={DevconnectFrameRate}
          schema={DevconnectISTProps}
          defaultProps={{
            type: '1',
            id: 'ethgunu',
            session: MOCK_SESSION[0],
          }}
        />

        {DevconnectEvents.map((event) => (
          <Fragment key={event.id}>
            <Composition
              id={event.id}
              component={Intro}
              width={1920}
              height={1080}
              durationInFrames={DevconnectIntroDuration}
              fps={DevconnectFrameRate}
              defaultProps={{
                type: event.type,
                id: event.id,
                session: MOCK_SESSION[0],
              }}
            />

            <Still
              id={`${event.id}-social`}
              component={Social}
              width={1200}
              height={630}
              defaultProps={{
                type: event.type,
                id: event.id,
                session: MOCK_SESSION[1],
              }}
            />
          </Fragment>
        ))}

        {/* <Composition
          id={'join-devconnect-ist'}
          component={Join}
          width={1920}
          height={1080}
          fps={DevconnectFrameRate}
          durationInFrames={
            DevconnectIntroDuration +
            20 * 25 +
            DevconnectOutroDuration -
            75
          } // intro (12s) + example video (20s) + outro (9s) minus 25 frames (1 sec) per transition
          defaultProps={{
            id: 'opening_remarks',
            eventId: 'epf-day',
            type: '2',
            videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoDuration: 20 * 25, // need to set this dynamically
            session: MOCK_SESSION[0],
          }}
        /> */}
      </Folder>

      <Folder name="0xParc">
        <Composition
          id={'progcrypto'}
          component={ProgCryptoIntro}
          width={1920}
          height={1080}
          durationInFrames={219}
          fps={DevconnectFrameRate}
          schema={ProgCryptoProps}
          defaultProps={{
            session: MOCK_SESSION[4],
          }}
        />

        <Composition
          id={'progcrypto-wide'}
          component={ProgCryptoWideIntro}
          width={4032}
          height={1344}
          durationInFrames={219}
          schema={ProgCryptoProps}
          fps={DevconnectFrameRate}
          defaultProps={{ session: MOCK_SESSION[3] }}
        />

        <Still
          id={`progcrypto-social`}
          component={ProgCryptoSocial}
          width={1200}
          height={630}
          schema={ProgCryptoProps}
          defaultProps={{
            session: MOCK_SESSION[4],
          }}
        />

        <Composition
          id={'autonomous-worlds-assembly'}
          component={AwaIntro}
          width={1920}
          height={1080}
          durationInFrames={250}
          fps={DevconnectFrameRate}
          defaultProps={{
            session: MOCK_SESSION[2],
          }}
        />

        <Still
          id={`autonomous-worlds-assembly-social`}
          component={AwaSocial}
          width={1200}
          height={630}
          defaultProps={{
            session: MOCK_SESSION[1],
          }}
        />
      </Folder>

      <Folder name="join-videos">
        {sessions
          .filter((session) => session.frameCount !== undefined)
          .map((session) => (
            <Composition
              id={`secureum-${session.id.replaceAll('_', '-')}`}
              component={JoinVideos}
              width={1920}
              height={1080}
              fps={25}
              durationInFrames={session.frameCount + 125}
              defaultProps={{
                id: session.id,
                coverImage: session.coverImage,
              }}
            />
          ))}
      </Folder>
    </>
  )
}
