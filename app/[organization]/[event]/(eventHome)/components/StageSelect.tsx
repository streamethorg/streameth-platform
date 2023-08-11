import { useContext } from 'react'
import { MobileContext } from '@/components/context/MobileContext'
import { IStage } from '@/server/model/stage'

const StageSelect = ({
  stages,
  selectedStage,
  setSelectedStage,
}: {
  stages: IStage[]
  selectedStage: string
  setSelectedStage: (stageId: string) => void
}) => {
  const { isMobile, isLoading } = useContext(MobileContext)

  if (isLoading) {
    return <></>
  }

  return (
    <>
      {isMobile ? (
        <div className="flex flex-row justify-center items-center p-2 ">
          <select className="text-xl cursor-pointer font-bold box-border" value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
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
            <div className="w-full p-4 text-center text-xl font-bold text-accent uppercase" key={stage.id}>
              {stage.name}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default StageSelect
