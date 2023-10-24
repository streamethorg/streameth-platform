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
    setStages([stages[0]])
  }, [isMobile])

  const handleStageChange = (stageId: string) => {
    setStages([stages.find((stage) => stage.id === stageId)])
    setSelectedStage(stageId)
  }

  return (
    <div>
      <select
        className="text-xl cursor-pointer font-bold box-border w-full p-2"
        value={selectedStage}
        onChange={(e) => handleStageChange(e.target.value)}>
        {stages.map((stage) => (
          <option key={stage.name} value={stage.id}>
            {stage.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default StageSelect
