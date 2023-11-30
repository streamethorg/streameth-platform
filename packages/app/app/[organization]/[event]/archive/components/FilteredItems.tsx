'use client'
import { useContext } from 'react'
import ArchivedSession from './ArchivedSession'
import { FilterContext } from '@/components/context/FilterContext'
import { ISession } from 'streameth-server/model/session'

const FilteredItems = ({ sessions }: { sessions: ISession[] }) => {
  const { filteredItems } = useContext(FilterContext)

  // filter items are sessions for the archive page while sessions prop are for the event page archive
  const sessionsToRender =
    filteredItems.length > 0 ? filteredItems : sessions

  return (
    <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 mb-10 lg:grid-cols-3 gap-4 md:overflow-scroll s-start">
      {sessionsToRender
        .filter((session: ISession) => session.videoUrl !== undefined)
        .map((session: ISession) => {
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
