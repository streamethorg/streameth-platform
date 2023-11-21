'use client'
import { useContext } from 'react'
import ArchivedSession from './ArchivedSession'
import { ISession } from '@/server/model/session'
import { FilterContext } from '@/components/context/FilterContext'

const FilteredItems = () => {
  const { filteredItems } = useContext(FilterContext)

  return (
    <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 md:overflow-scroll s-start">
      {filteredItems
        .filter((session) => session.videoUrl !== undefined)
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
