'use client'
import { useState, useContext } from 'react'
import { MobileContext } from '@/components/context/MobileContext'

import { IStage } from '@/server/model/stage'
import { IEvent } from '@/server/model/event'

import ScheduleGrid from './ScheduleGrid'
import SessionsOnGrid from './SessionsOnGrid'
import DateFilter from './Filter'
import StageSelect from './StageSelect'
const SchedulePage = ({ stages, event }: { stages: IStage[]; event: IEvent }) => {
  const [selectedStage, setSelectedStage] = useState(stages[0].id)
  const { isMobile, isLoading } = useContext(MobileContext)

  if (isLoading) {
    return <>loading</>
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-row flex-wrap md:flex-col bg-base justify-center">
        <DateFilter event={event} />
        <StageSelect stages={stages} selectedStage={selectedStage} setSelectedStage={setSelectedStage} />
      </div>
      <ScheduleGrid>
        <div className="flex flex-row right-0 h-full absolute top-0 w-[calc(100%-5rem)]">
          {isMobile ? (
            <SessionsOnGrid stageId={selectedStage} />
          ) : (
            stages.map((stage) => (
              <div className="w-full h-full relative" key={stage.id}>
                <SessionsOnGrid stageId={stage.id} />
              </div>
            ))
          )}
        </div>
      </ScheduleGrid>
    </>
  )
}

export default SchedulePage
