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
      {sessions.map((session: SessionType) => (
        <Composition
          id={session.id.replace(/_/g, '-')}
          component={Session}
          width={1920}
          height={1080}
          durationInFrames={G_DURATION}
          fps={G_FPS}
          defaultProps={{ session }}
        />
      ))}

    </>
  )
}

// For in the future
// {sessions.map((session: SessionType) => (
//   <Still id={`still-${session.id.replace(/_/g, '-')}`} component={Session} width={1920} height={1080} defaultProps={{ session }} />
// ))}
// {sessions.map((session: SessionType) => (
//   <Still id={`social-${session.id.replace(/_/g, '-')}`} component={Session} width={1200} height={630} defaultProps={{ session }} />
// ))}
