'use client'
import { useContext, useState } from 'react'
import { MobileContext } from '@/components/context/MobileContext'
import { ScheduleContext } from './ScheduleContext'
import { IStage } from '@server/model/stage'

const StageSelect = ({ stages }: { stages: IStage[] }) => {
  const { setStage } = useContext(ScheduleContext)
  const [selectedStage, setSelectedStage] = useState<string>('')

  const handleStageChange = (stageId: string) => {
    setStage(stageId)
    setSelectedStage(stageId)
  }

  return (
    <select
      className="px-3 py-2 border border-accent shadow rounded-lg bg-inherit text-lg cursor-pointer box-border w-full "
      value={selectedStage}
      onChange={(e) => handleStageChange(e.target.value)}>
      {stages.map((stage) => (
        <option key={stage.name} value={stage.id}>
          {stage.name}
        </option>
      ))}
    </select>
  )
}

export default StageSelect
