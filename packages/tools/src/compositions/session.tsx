import { AbsoluteFill, Audio, Img, staticFile } from 'remotion'
import { MinSession as SessionType } from '../types'

interface Props {
  session: SessionType
}

export const TEST_SESSION: SessionType = {
  id: 'session-1',
  name: 'Test Session ',
  description: 'Lorem ipsum dolor sit amet..',
  speakers: [
    {
      id: 'speaker-1',
      name: 'Speaker 1',
      avatar: '12',
    },
    {
      id: 'speaker-2',
      name: 'Zwei',
      description: 'Chief Streaming Officer',
      avatar: '123',
      twitter: '@streameth',
    },
  ],
}

export function Session() {
  const session = TEST_SESSION
  const bgImage = staticFile('images/background.png')

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/static.wav')} />

      <AbsoluteFill className="bg-black">
        <Img src={bgImage} />
      </AbsoluteFill>

      <AbsoluteFill className="content-start p-20">
        <div>Logo</div>

        <div className="flex flex-col items-center justify-center my-10">
          <div className="my-10">{session.name}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
