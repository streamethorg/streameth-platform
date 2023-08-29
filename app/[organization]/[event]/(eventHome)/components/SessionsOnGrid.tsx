import { CELL_HEIGHT, getSlotRange } from '../utils'
import { ISession } from '@/server/model/session'
import ScheduleCard from '@/components/schedule/ScheduleCard'

const SessionsOnSchedule = ({ sessions, earliestTime }: { sessions: ISession[]; earliestTime: number }) => {
  return (
    <div className="w-full h-full relative">
      {sessions.map((session) => {
        const range = getSlotRange(session, earliestTime)
        return (
          <div
            key={session.id}
            className="absolute right-0 h-full w-full p-1"
            style={{
              top: range.start * CELL_HEIGHT + 'rem',
              height: (range.end - range.start) * CELL_HEIGHT + 'rem',
            }}>
            {session.name !== 'Blank' && <ScheduleCard session={session} />}
          </div>
        )
      })}
    </div>
  )
}

export default SessionsOnSchedule
