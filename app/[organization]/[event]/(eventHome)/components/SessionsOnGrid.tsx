import { useMemo, useContext } from 'react'
import { CELL_HEIGHT, getSlotRange, addBlankSessions, getEarliestTime, getTotalSlots } from '../utils'
import { ISession } from '@/server/model/session'
import ScheduleCard from '@/components/schedule/ScheduleCard'
import { FilterContext } from '../../archive/components/FilterContext'

const SessionsOnSchedule = ({ stageId }: { stageId: string }) => {
  const { filteredItems: sessions } = useContext(FilterContext)

  const earliestTime = useMemo(() => getEarliestTime(sessions), [sessions])

  const sessionsWithBlank = useMemo(
    () =>
      addBlankSessions(
        sessions.filter((session: ISession) => session.stageId === stageId).sort((a: ISession, b: ISession) => a.start.getTime() - b.start.getTime()),
        earliestTime
      ),
    [stageId, sessions, earliestTime]
  )

  if (!sessions) {
    return <div>No scheduled sessions</div>
  }

  return (
    <>
      {sessionsWithBlank.map((session) => {
        const range = getSlotRange(session, earliestTime)
        return (
          <div
            key={session.id}
            className="absolute right-0 h-full w-full p-1"
            style={{
              top: range.start * CELL_HEIGHT + "rem",
              height: (range.end - range.start) * CELL_HEIGHT + "rem",
            }}
          >
            {session.name !== "Blank" && <ScheduleCard session={session}  />}
          </div>
        )
      })}
    </>
  );
};

export default SessionsOnSchedule
