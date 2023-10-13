'use client'
import { useContext, useEffect } from 'react'
import { FilterContext } from '../../../../../components/context/FilterContext'
import ArchivedSession from './ArchivedSession'
import { ISession } from '@/server/model/session'

const FilteredItems = ({ sessions }: { sessions: ISession[] }) => {
  const { filteredItems, setItems } = useContext(FilterContext)
  useEffect(() => {
    setItems(sessions.filter((session) => session.videoUrl !== undefined))
  }, [sessions])
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 md:overflow-scroll s-start">
      {filteredItems.map((session: ISession) => {
        return <ArchivedSession session={session} key={session.id} learnMore />
      })}
    </div>
  )
}

export default FilteredItems
