'use client'
import { useState, useRef } from 'react'
import SearchFilter from './SearchFilter'
import SelectFilter from './SelectFilter'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { ISession } from '../../../../../../server/model/session'
import { ISpeaker } from '../../../../../../server/model/speaker'
import { IStage } from '../../../../../../server/model/stage'

function FilterBar({
  sessions,
  speakers,
  stages,
}: {
  sessions: ISession[]
  speakers: ISpeaker[]
  stages: IStage[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const inputBarRef = useRef<HTMLDivElement>(null)

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
    const uniqueDatesSet = new Set(
      sessions.map((session) =>
        new Date(session.start).toLocaleDateString()
      )
    )
    const uniqueDates = Array.from(uniqueDatesSet)

    return uniqueDates.map((date) => ({
      name: date,
      value: date,
      type: 'date',
      filterFunc: async (item: ISession) => {
        return new Date(item.start).toLocaleDateString() === date
      },
    }))
  }

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
    <div
      key={1}
      className={`w-full max-w-[600px] m-auto z-50 ${
        isOpen && 'h-full '
      } `}
      ref={inputBarRef}>
      <div className="flex flex-row items-center justify-top  w-full h-full">
        <div className="flex flex-row w-full relative h-full items-center justify-center">
          <SearchFilter
            filterOptions={sessionFilters}
            filterName="session name"
            items={sessions}
          />

          {isOpen && (
            <div
              className="absolute w-full space-y-2 bg-accent rounded-xl p-4 shadow-sm"
              // Set the top position based on the height of the input bar.
              style={{
                top: inputBarRef.current
                  ? inputBarRef.current.getBoundingClientRect()
                      .height + 'px'
                  : 'auto',
                width: inputBarRef.current?.offsetWidth,
              }}>
              {' '}
              <SelectFilter
                filterOptions={stageFilters}
                filterName="Stage"
              />
              <SelectFilter
                filterOptions={sessionDateFilters()}
                filterName="Date"
              />
              <SearchFilter
                items={sessions}
                filterOptions={speakerFilters}
                filterName="speaker"
              />
            </div>
          )}
        </div>
        <AdjustmentsHorizontalIcon
          className="h-full w-8 cursor-pointer text-base md:ml-2"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  )
}

export default FilterBar
