'use client'
import { useContext, useEffect, useState } from 'react'
import { MobileContext } from '@/components/context/MobileContext'
import { ScheduleContext } from './ScheduleContext'
import { IStage } from '@/server/model/stage'

const StageSelect = ({ stages }: { stages: IStage[] }) => {
  const { isMobile } = useContext(MobileContext)
  const { setStages } = useContext(ScheduleContext)
  const [selectedStage, setSelectedStage] = useState<string>('')
  useEffect(() => {
    if (isMobile) {
      setStages([stages[0]])
    } else {
      setStages(stages)
    }
  }, [isMobile])

  const handleStageChange = (stageId: string) => {
    setStages([stages.find((stage) => stage.id === stageId)])
    setSelectedStage(stageId)
  }

  return (
    <>
      {isMobile ? (
        <div className="flex flex-row justify-center items-center p-2">
          <select
            className="text-xl text-accent cursor-pointer font-bold box-border w-full"
            value={selectedStage}
            onChange={(e) => handleStageChange(e.target.value)}>
            {stages.map((stage) => (
              <option key={stage.name} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="w-[calc(100%-6rem)] flex flex-row ml-auto">
          {stages.map((stage) => (
            <div
              className="w-full p-4 text-center text-xl font-bold text-accent uppercase"
              key={stage.id}>
              {stage.name}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default StageSelect
