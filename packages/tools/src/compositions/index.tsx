import { Composition, Still } from 'remotion'
import Session from './session'
import { ISession as SessionType } from '../types'
import { G_FPS, G_DURATION } from '../consts'

export const CURRENT_SESSION = "public/json/sessions.json"

export function Compositions() {
  return (
    <>
      <Composition
        id="session"
        component={Session}
        width={1920}
        height={1080}
        durationInFrames={G_DURATION}
        fps={G_FPS}
        defaultProps={{ session: CURRENT_SESSION }}
      />

      <Still id="session-hd" component={Session} width={1920} height={1080} defaultProps={{ session: CURRENT_SESSION }} />
      <Still id="session-social" component={Session} width={1200} height={630} defaultProps={{ session: CURRENT_SESSION }} />
    </>
  )
}
