import {
  Composition,
  Folder,
  Still,
  continueRender,
  delayRender,
} from 'remotion'
import { MOCK_SESSION } from '../utils/mocks'
import { Fragment } from 'react'
import { JoinVideos } from './join'
import {
  DevconnectEvents,
  DevconnectFrameRate,
  DevconnectIntroDuration,
  DevconnectOutroDuration,
  ProgCryptoFont_Reg,
  ProgCryptoFont_Med,
  Join,
  Intro,
  Social
} from './progcrypto'
//   Social,
// import {
//   DevconnectEvents,
//   DevconnectFrameRate,
//   DevconnectIntroDuration,
//   DevconnectOutroDuration,
//   DevconnectISTFont,
//   Join,
//   Intro,
//   Social,
// } from './autonamous_worlds_assembly'

export function Compositions() {
  const waitForFont = delayRender()
  // const font = DevconnectISTFont
  const font = ProgCryptoFont_Reg
  const font2 = ProgCryptoFont_Med

  font
    .load()
    .then(() => {
      document.fonts.add(font)
      continueRender(waitForFont)
    })
    .catch((err) => console.log('Error loading font', err))

  font2
    .load()
    .then(() => {
      document.fonts.add(font2)
      continueRender(waitForFont)
    })
    .catch((err) => console.log('Error loading font', err))

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

        <Composition
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
        />
      </Folder>

      <Composition
        id={'join-videos'}
        component={JoinVideos}
        width={1920}
        height={1080}
        fps={25}
        durationInFrames={525} // Total of all video durations minus 25 frames (1 sec) per transition
        defaultProps={{
          videos: [
            {
              pathOrUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: 150,
            },
            {
              pathOrUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: 300,
            },
            {
              pathOrUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: 150,
            },
          ],
        }}
      />
    </>
  )
}
