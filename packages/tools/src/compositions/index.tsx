import { Composition, Still } from 'remotion'
import Session from './session'
import { ISession as SessionType } from '../types'
import { G_FPS, G_DURATION } from '../consts'
import CURRENT_SESSION from '../../public/json/sessions.json'

const sessions: SessionType[] = CURRENT_SESSION.map((session) => {
  return {
    ...session,
    start: new Date(session.start),
    end: new Date(session.end),
  }
})

export function Compositions() {
  return (
    <>
      {sessions.map((session: SessionType, i: number) => (
        <Composition
          id={session.id.replace(/_/g, '-')}
          component={Session}
          width={1920}
          height={1080}
          durationInFrames={G_DURATION}
          fps={G_FPS}
          defaultProps={{ session: session }}
        />
      ))}
      <Still id="session-hd" component={Session} width={1920} height={1080} defaultProps={{ session: sessions[0] }} />
      <Still id="session-social" component={Session} width={1200} height={630} defaultProps={{ session: sessions[0] }} />
    </>
  )
}
