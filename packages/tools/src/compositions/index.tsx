import { Composition, Folder, Still } from 'remotion'
import Session from './session'
import { ISession as SessionType } from '../types'
import { G_FPS, G_DURATION } from '../consts'
import CURRENT_SESSION from '../../public/json/sessions.json'
import { DevconnectIST, DevconnectISTStill } from './devconnect.tsx/ist'
import { CreateAvatar } from '../utils/avatars'

const sessions: SessionType[] = CURRENT_SESSION.map((session) => {
  return {
    ...session,
    start: new Date(session.start),
    end: new Date(session.end),
  }
})

const defaultProps = {
  type: '5',
  session: {
    name: "Buidl the Buidlers: How You Can Create the Next Generation of Web3 Contributors",
    start: 1694248200000,
    end: 1694249400000,
    speakers: [
      {
        id: "sarah",
        name: "Sarah Noon",
        photo: "https://xsgames.co/randomusers/assets/avatars/female/36.jpg"
      },
      {
        id: "arthur",
        name: "Arthur Pitt Neumann",
        photo: "https://xsgames.co/randomusers/assets/avatars/pixel/34.jpg"
      },
      {
        id: "flynn",
        name: "James Flynn",
        photo: CreateAvatar("flynn")
      },
      {
        id: "george",
        name: "George Bass",
        photo: "https://xsgames.co/randomusers/assets/avatars/pixel/0.jpg"
      },
      {
        id: "chidiebere",
        name: "Chidiebere Emery",
        photo: "https://xsgames.co/randomusers/assets/avatars/female/39.jpg"
      },
      {
        id: "maria",
        name: "Maria Nelson Luca de Witt",
        photo: CreateAvatar("Maria Nelson")
      },
      {
        id: "griff",
        name: "Griff Yellow",
        photo: CreateAvatar("yellow")
      },
      {
        id: "andy",
        name: "Andy Nielson",
        photo: "https://xsgames.co/randomusers/assets/avatars/male/66.jpg"
      },
    ],
  }
}

export const DevconnectISTDuration = 12 * G_FPS

export function Compositions() {
  return (
    <>
      <Folder name="Devconnect">
        <Composition
          id="devconnect-ist-1"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '1',
            session: {
              ...defaultProps.session,
              name: 'Buidl the Buidlers',
              speakers: defaultProps.session.speakers.slice(0, 1)
            }
          }}
        />
        <Composition
          id="devconnect-ist-2"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '2',
            session: {
              ...defaultProps.session,
              name: 'How You Can Create the Next Generation of Web3 Contributors',
              speakers: defaultProps.session.speakers.slice(0, 4)
            }
          }}
        />
        <Composition
          id="devconnect-ist-3"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '3',
            session: {
              ...defaultProps.session,
              name: 'Buidl the Buidlers: How You Can Create the Next Generation of Web3 Contributors through Education, Peer Review, and Professional Development'
            }
          }}
        />
        <Composition
          id="devconnect-ist-4"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '4',
            session: {
              ...defaultProps.session,
              name: 'Buidl the Buidlers: How You Can Create the Next Generation of Web3 Contributors'
            }
          }}
        />
        <Composition
          id="devconnect-ist-5"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '5',
            session: {
              ...defaultProps.session,
              speakers: defaultProps.session.speakers.slice(0, 3)
            }
          }}
        />
        <Composition
          id="devconnect-ist-6"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '6',
            session: {
              ...defaultProps.session,
              speakers: defaultProps.session.speakers.slice(0, 3)
            }
          }}
        />
        <Composition
          id="devconnect-ist-7"
          component={DevconnectIST}
          width={1920}
          height={1080}
          durationInFrames={DevconnectISTDuration}
          fps={G_FPS}
          defaultProps={{
            ...defaultProps,
            type: '7',
            session: {
              ...defaultProps.session,
              speakers: defaultProps.session.speakers.slice(0, 3)
            }
          }}
        />

        <Still id="devconnect-ist-still" component={DevconnectISTStill} width={1920} height={1080} defaultProps={defaultProps} />
        <Still id="devconnect-ist-still-social" component={DevconnectISTStill} width={1200} height={630} defaultProps={defaultProps} />
      </Folder>

      <Folder name="Ftc">
        <Composition
          id={sessions[0].id.replace(/_/g, '-')}
          component={Session}
          width={1920}
          height={1080}
          durationInFrames={G_DURATION}
          fps={G_FPS}
          defaultProps={{ session: sessions[0] }}
        />
      </Folder>
    </>
  )
}
