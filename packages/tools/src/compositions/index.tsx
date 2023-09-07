import { Composition, Still } from 'remotion'
import { Session } from './session'
import { MinSession as SessionType } from 'types'

export const TEST_SESSION: SessionType = {
  id: 'session-1',
  name: 'Test Session ',
  description: 'Lorem ipsum dolor sit amet..',
  speakers: [
    {
      id: 'speaker-1',
      name: 'Speaker 1',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80',
    },
    {
      id: 'speaker-2',
      name: 'Zwei',
      description: 'Chief Streaming Officer',
      avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      twitter: '@streameth',
    },
  ],
}

export function Compositions() {
  return (
    <>
      <Composition
        id="session"
        component={Session}
        width={1920}
        height={1080}
        durationInFrames={120}
        fps={30}
        defaultProps={{ session: TEST_SESSION }}
      />

      <Still id="session-hd" component={Session} width={1920} height={1080} defaultProps={{ session: TEST_SESSION }} />
      <Still id="session-social" component={Session} width={1200} height={630} defaultProps={{ session: TEST_SESSION }} />
    </>
  )
}
