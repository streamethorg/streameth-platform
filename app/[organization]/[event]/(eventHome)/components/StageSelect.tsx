"use client"
import { useContext, useEffect, useState } from 'react'
import { MobileContext } from '@/components/context/MobileContext'
import { ScheduleContext } from './ScheduleContext' // Update the path to where your ScheduleContext is located

interface props {
  stages: any[]
}
const StageSelect = (props: props) => {
  const { isMobile } = useContext(MobileContext)
  const { setStages } = useContext(ScheduleContext)
  const [selectedStage, setSelectedStage] = useState<string>('')
  useEffect(() => {
    if (isMobile) {
      setStages([props.stages[0]])
    }

  }, [isMobile])

  const handleStageChange = (stageId: string) => {
    setStages([props.stages.find((stage) => stage.id === stageId)])
    setSelectedStage(stageId)
  }

  return (
    <>
      {isMobile ? (
        <div className="flex flex-row justify-center items-center p-2 ">
          <select className="text-xl cursor-pointer font-bold box-border" value={selectedStage} onChange={(e) => handleStageChange(e.target.value)}>
            {props.stages.map((stage) => (
              <option key={stage.name} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="w-[calc(100%-6rem)] flex flex-row ml-auto">
          {props.stages.map((stage) => (
            <div
              className="w-full p-4 text-center text-xl font-bold text-accent uppercase"
              key={stage.id}
              onClick={() => handleStageChange(stage.id)}>
              {stage.name}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default StageSelect
