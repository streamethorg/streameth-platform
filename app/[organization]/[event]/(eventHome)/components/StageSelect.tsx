"use client"
import { useContext, useEffect } from 'react'
import { MobileContext } from '@/components/context/MobileContext'
import { ScheduleContext } from './ScheduleContext' // Update the path to where your ScheduleContext is located

const StageSelect = () => {
  const { isMobile, isLoading: isMobileLoading } = useContext(MobileContext)
  const { setStage, stage, isLoading: isScheduleLoading, stages } = useContext(ScheduleContext)


  useEffect(() => {
    console.log('isMobile', isMobile)
    if (isMobile) {
      setStage(stages[0].id)
    }
    else {
      setStage(null)
    }
  }, [isMobile])

  const isLoading = isMobileLoading || isScheduleLoading

  if (isLoading) {
    return <></>
  }

  const handleStageChange = (stageId: string) => {
    setStage(stageId)
  }

  return (
    <>
      {isMobile ? (
        <div className="flex flex-row justify-center items-center p-2 ">
          <select className="text-xl cursor-pointer font-bold box-border" value={stage} onChange={(e) => handleStageChange(e.target.value)}>
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
