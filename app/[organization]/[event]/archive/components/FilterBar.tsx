'use client'
import { useState, useContext } from 'react'
import SearchFilter from './SearchFilter'
import SelectFilter from './SelectFilter'
import { ISession } from '@/server/model/session'
import { ISpeaker } from '@/server/model/speaker'
import { IStage } from '@/server/model/stage'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { ModalContext } from '@/components/context/ModalContext'
export default function FilterBar({ sessions, speakers, stages }: { sessions: ISession[]; speakers: ISpeaker[]; stages: IStage[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const speakerFilters = speakers.map((speaker) => {
    return {
      name: speaker.name,
      value: speaker.id,
      type: 'speaker',
      filterFunc: async (item: ISession) => {
        return item.speakers.some((sessionSpeaker) => {
          return sessionSpeaker.id === speaker.id
        })
      },
    }
  })

  const sessionFilters = sessions.map((session) => {
    return {
      name: session.name,
      value: session.name,
      type: 'name',
      filterFunc: async (item: ISession) => {
        return item.name === session.name
      },
    }
  })

  const sessionDateFilters = () => {
    const uniqueDates = Array.from(new Set(sessions.map((session) => session.start)))

    uniqueDates.sort((a, b) => {
      return a - b
    })

    return uniqueDates.map((date) => ({
      name: new Date(date).toLocaleDateString(),
      value: date,
      type: 'date',
      filterFunc: async (item: ISession) => {
        return item.start === date
      },
    }))
  }

  const trackFilter = sessions.map((session) => {
    return {
      name: session.track,
      value: session.track,
      type: 'track',
      filterFunc: async (item: ISession) => {
        return item.track === session.track
      },
    }
  })

  const stageFilters = stages.map((stage) => {
    return {
      name: stage.name,
      value: stage.id,
      type: 'stage',
      filterFunc: async (item: ISession) => {
        return item.stageId === stage.id
      },
    }
  })

  return (
    <div className={`absolute top-0 left-16 lg:right-1/2 lg:left-[35%] w-60 md:w-96 px-4 ${isOpen && 'h-full '} `}>
      <div className="flex flex-col justify-top items-start  w-full h-full py-2 md:py-3">
        <div className="flex flex-row w-full">
          <SearchFilter filterOptions={sessionFilters} filterName="session name" />
          <div className="ml-2  p-2 h-12 border rounded bg-primary text-main-text placeholder:text-main-text placeholder:text-sm">
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-accent" onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>
        {isOpen && (
          <div className=" w-full mt-1 space-y-2 bg-white rounded p-2 shadow-sm">
            <SelectFilter filterOptions={stageFilters} filterName="Stage" />
            <SelectFilter filterOptions={sessionDateFilters()} filterName="Date" />
            <SearchFilter filterOptions={speakerFilters} filterName="speaker" />

          </div>
        )}
      </div>
    </div>
  )
}
