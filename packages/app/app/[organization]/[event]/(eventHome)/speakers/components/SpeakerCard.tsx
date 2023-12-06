'use client'
import SpeakerModal from './SpeakerModal'
import { ModalContext } from '@/context/ModalContext'
import { useContext } from 'react'
import SpeakerPhoto from './SpeakerPhoto'
import { ISpeaker } from 'streameth-server/model/speaker'
import { ISession } from 'streameth-server/model/session'

const SpeakerCard = ({
  speaker,
  sessions,
}: {
  speaker: ISpeaker
  sessions: ISession[]
}) => {
  const { openModal } = useContext(ModalContext)
  const speakerSessions = sessions.filter((session) =>
    session.speakers.some(
      (sessionSpeaker) => sessionSpeaker.id === speaker.id
    )
  )

  return (
    <div
      onClick={() =>
        openModal(
          <SpeakerModal
            speaker={speaker}
            sessions={speakerSessions}
          />
        )
      }
      className="flex flex-col items-center cursor-pointer">
      <div className="border-1 shadow rounded-xl w-32 lg:w-44 mx-auto">
        <SpeakerPhoto speaker={speaker} size="lg" />
      </div>
      <div className="mx-auto text-center mt-2">
        <h3 className="text-md lg:text-lg md:text-xl mb-0">
          {speaker.name}
        </h3>
        <p className="text-black-500 text-md">{speaker.company}</p>
      </div>
    </div>
  )
}

export default SpeakerCard
