'use client'
import { ISession } from '@/server/model/session'
import SpeakerPhoto from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerPhoto'
import { ModalContext } from '@/components/context/ModalContext'
import { useContext } from 'react'
import ScheduleCardModal from './ScheduleCardModal'

const ScheduleCard = ({ session, showTime = false, speakers = false }: { session: ISession; showTime?: boolean; speakers?: boolean }) => {
  const { openModal } = useContext(ModalContext)
  const isActive = new Date(session.start).getTime() < Date.now() && new Date(session.end).getTime() > Date.now() // TODO: Test Active

  return (
    <div
      className="flex space-y-3 flex-col w-full h-full bg-base shadow rounded p-2 cursor-pointer"
      onClick={() => {
        openModal(<ScheduleCardModal session={session} />)
      }}>
      <div className=" border-l border-accent flex flex-col p-4 py-2 rounded-tr rounded-br w-full h-full">
        {showTime && (
          <p className="text-main-text text-sm uppercase py-1">
            {new Date(session.start).getHours().toString().padStart(2, '0') + ':' + new Date(session.start).getMinutes().toString().padStart(2, '0')}-
            {new Date(session.end).getHours().toString().padStart(2, '0') + ':' + new Date(session.end).getMinutes().toString().padStart(2, '0')}
          </p>
        )}
        <p className="flex overflow-hidden text-ellipsis text-main-text text-sm font-medium uppercase">{session.name}</p>
        {speakers && (
          <div className="flex mt-auto py-1 items-center flex-row space-x-2">
            {session.speakers.map((speaker) => (
              <SpeakerPhoto size="sm" key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
        {isActive && <p className="text-bold text-red-500 ml-auto animate-pulse">Live</p>}
      </div>
    </div>
  )
}

export default ScheduleCard
