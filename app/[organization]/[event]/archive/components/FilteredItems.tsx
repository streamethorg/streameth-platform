'use client'
import { useContext } from 'react'
import ArchivedSession from './ArchivedSession'
import { ISession } from '@/server/model/session'
import { FilterContext } from '@/components/context/FilterContext'
import { formatId } from '@/server/utils'

interface sessionsByStageProps {
  stageId: string
  sessions: ISession[]
}

const FilteredItems = ({ sessions }: { sessions: ISession[] }) => {
  const { filteredItems } = useContext(FilterContext)

  const sessionsToRender =
    filteredItems.length > 0 ? filteredItems : sessions

  const sessionsByStage = sessionsToRender?.reduce((acc, item) => {
    const existingItem = acc.find(
      (session: ISession) => session.stageId === item.stageId
    )
    if (existingItem) {
      existingItem.sessions.push({
        eventId: item.eventId,
        name: item.name,
        coverImage: item.coverImage,
        videoUrl: item.videoUrl,
        id: item.id,
        stageId: item.stageId,
      })
    } else {
      acc.push({
        stageId: item.stageId,
        sessions: [
          {
            eventId: item.eventId,
            name: item.name,
            coverImage: item.coverImage,
            videoUrl: item.videoUrl,
            id: item.id,
            stageId: item.stageId,
          },
        ],
      })
    }
    return acc
  }, [])

  return (
    <div className="p-4">
      {sessionsByStage.map((item: sessionsByStageProps) => (
        <div key={item.stageId}>
          <div className="text-lg md:text-2xl w-fit font-ubuntu font-bold my-5 rounded-xl bg-base p-4 text-white">
            Stage: {formatId(item.stageId)}
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 mb-10 lg:grid-cols-3 gap-4 md:overflow-scroll s-start">
            {item.sessions
              .filter(
                (session: ISession) => session.videoUrl !== undefined
              )
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
        </div>
      ))}
    </div>
  )
}

export default FilteredItems
