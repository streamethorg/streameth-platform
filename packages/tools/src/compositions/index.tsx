import { Composition, Folder, Still } from 'remotion'
import Session from './ftc/session'
import { G_FPS } from '../consts'
import { Intro } from './devconnect/intro'
import { Social } from './devconnect/social'
import { MOCK_SESSION } from '../utils/mocks'

export const DevconnectISTDuration = 12 * G_FPS
export const FtcDuration = 170

export function Compositions() {
  return (
    <>
      <Folder name="Devconnect">
        <Composition
          id="evm-summit"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '1', logo: 'evm-summit', session: MOCK_SESSION[0] }}
        />
        <Still id="evm-summit-social" component={Social} width={1200} height={630} defaultProps={{
          type: '1',
          logo: 'evm-summit',
          session: MOCK_SESSION[0]
        }} />

        <Composition
          id="devconnect-ist-2"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '2', session: MOCK_SESSION[1] }}
        />
        <Still id="devconnect-ist-social-2" component={Social} width={1200} height={630} defaultProps={{
          type: '2',
          session: MOCK_SESSION[1]
        }} />

        <Composition
          id="devconnect-ist-3"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '3', session: MOCK_SESSION[2] }}
        />

        <Composition
          id="devconnect-ist-4"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '4', session: MOCK_SESSION[3] }}
        />
        
        <Composition
          id="devconnect-ist-5"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '5', session: MOCK_SESSION[0] }}
        />
        <Composition
          id="devconnect-ist-6"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '6', session: MOCK_SESSION[1] }}
        />
        <Composition
          id="devconnect-ist-7"
          component={Intro}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{ type: '7', session: MOCK_SESSION[2] }}
        />
      </Folder>

      <Folder name="Ftc">
        <Composition
          id={MOCK_SESSION[0].id.replace(/_/g, '-')}
          component={Session}
          width={1920}
          height={1080}
          durationInFrames={FtcDuration}
          fps={G_FPS}
          defaultProps={{ session: MOCK_SESSION[0] }}
        />
      </Folder>
    </>
  )
}
