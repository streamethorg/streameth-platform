import { Composition, Folder, Still, continueRender, delayRender, staticFile } from 'remotion'
import { G_FPS } from '../consts'
import { Intro } from './devconnect/intro'
import { Social } from './devconnect/social'
import { MOCK_SESSION } from '../utils/mocks'
import { Fragment } from 'react'

export const DevconnectISTDuration = 12 * G_FPS
export const FtcDuration = 170

// 1 = blue/teal
// 2 = teal/orange
// 3 = yellow/orange
// 4 = red
// 5 = pink/purple
// 6 = purple
// 7 = blue

export const DevconnectEvents = [
  { id: 'epf-day', type: '5' },
  { id: 'ethconomics', type: '4' },
  { id: 'ethgunu', type: '7' },
  { id: 'evm-summit', type: '3' },
  { id: 'solidity-summit', type: '6' },
  { id: 'light-client-summit', type: '1' },
  { id: 'fe-lang-hackathon', type: '1' },
  { id: 'conflux--web3-ux-unconference', type: '7' },
  { id: 'wallet-unconference', type: '2' },
  // { id: 'cryptographic-resilience-within-ethereum', type: '4' },
]

export function Compositions() {
  const waitForFont = delayRender()
  const font = new FontFace(
    `Sofia Sans Extra Condensed`,
    `url('${staticFile('devconnect/fonts/SofiaSansExtraCondensed-Medium.ttf')}') format('truetype')`,
  )

  font
    .load()
    .then(() => {
      document.fonts.add(font);
      continueRender(waitForFont);
    })
    .catch((err) => console.log("Error loading font", err));

  return (
    <>
      <Folder name="Devconnect">
        {DevconnectEvents.map((event) => (
          <Fragment key={event.id}>
            <Composition
              id={event.id}
              component={Intro}
              width={1920}
              height={1080}
              durationInFrames={DevconnectISTDuration}
              fps={G_FPS}
              defaultProps={{ type: event.type, id: event.id, session: MOCK_SESSION[0] }}
            />

            <Still id={`${event.id}-social`} component={Social} width={1200} height={630} defaultProps={{ type: event.type, id: event.id, session: MOCK_SESSION[1] }} />
          </Fragment>
        ))}
      </Folder>

      {/* <Folder name="Ftc">
        <Composition
          id={MOCK_SESSION[0].id.replace(/_/g, '-')}
          component={Session}
          width={1920}
          height={1080}
          durationInFrames={FtcDuration}
          fps={G_FPS}
          defaultProps={{ session: MOCK_SESSION[0] }}
        />
      </Folder> */}
    </>
  )
}
