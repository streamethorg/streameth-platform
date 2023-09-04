import { ISession } from '@/server/model/session'
import SpeakerIconList from '../speakers/SpeakerIconList'

const ScheduleCardModal = ({ session }: { session: ISession }) => {
  return (
    <div className="flex flex-col p-4 border-b-2 border-b-accent">
      <h1 className="text-lg text-main-text font-bold text-center">{session.name}</h1>
      <div className="flex flex-row justify-center items-center space-x-3 p-2">
        <p className="text-secondary-text">{new Date(session.start).toTimeString().slice(0, 5)}</p>
         - 
        <p className="text-secondary-text">{new Date(session.end).toTimeString().slice(0, 5)}</p>
      </div>
      <p className="py-4">{session.description}</p>
      <SpeakerIconList speakers={session.speakers} />
    </div>
  )
}

export default ScheduleCardModal
