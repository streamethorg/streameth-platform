import ArchivedSession from './ArchivedSession'
import { ISession } from '@/server/model/session'

const FilteredItems = ({ sessions }: { sessions: ISession[] }) => {
  return (
    <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 md:overflow-scroll s-start">
      {sessions.filter((session) => session.videoUrl !== undefined).map((session: ISession) => {
        return (
          <ArchivedSession
            session={session}
            key={session.id}
            learnMore
          />
        )
      })}
    </div>
  )
}

export default FilteredItems
