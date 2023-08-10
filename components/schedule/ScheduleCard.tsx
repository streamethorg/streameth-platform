import { ISession } from '@/server/model/session'
import SpeakerIcon from '@/components/speakers/SpeakerIcon'
import { ModalContext } from '../context/ModalContext'
import { useContext } from 'react'
import ScheduleCardModal from '@/components/schedule/ScheduleCardModal'
const ScheduleCard = ({ session, showTime = false }: { session: ISession; showTime?: boolean }) => {
  const { openModal } = useContext(ModalContext)
  // test isActive
  const isActive = session.start.getTime() < Date.now() && session.end.getTime() > Date.now()
  return (
    <div
      className="flex space-y-3 flex-col w-full h-full bg-base shadow rounded p-2 cursor-pointer"
      onClick={() => {
        openModal(<ScheduleCardModal session={session} />)
      }}>
      <div className=" border-l border-accent flex flex-col p-4 py-2 rounded-tr rounded-br w-full h-full">
        {showTime && (
          <p className="text-main-text text-sm uppercase py-1">
            {session.start.getHours().toString().padStart(2, '0') + ':' + session.start.getMinutes().toString().padStart(2, '0')}-
            {session.end.getHours().toString().padStart(2, '0') + ':' + session.end.getMinutes().toString().padStart(2, '0')}
          </p>
        )}
        <p className="flex h-2/4 py-1 overflow-hidden text-ellipsis text-main-text text-sm font-medium uppercase">{session.name}</p>
        <div className="flex h-2/4 py-1 items-center flex-row space-x-2">
          {session.speakers.map((speaker) => (
            <SpeakerIcon key={speaker.id} speaker={speaker} onlyImage />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScheduleCard
