'use client'
import StreamConfig from './StreamConfig'
import Clips from './Clips'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { IExtendedSession } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
const StageSettings = ({
  stages,
  sessions,
}: {
  stages: IStageModel[]
  sessions: IExtendedSession[]
}) => {
  const searchParams = useSearchParams()

  const selectedSetting = searchParams.get('setting')
  const selectedStage = searchParams.get('stage')
  if (selectedSetting !== 'stages') return null
  const stage =
    stages.filter((stage) => stage._id === selectedStage)[0] ||
    stages[0]

  return (
    <div className="w-full h-full">
      <div className="p-2 h-full">
        <StreamConfig stage={stage} />
        <Clips
          stage={stage}
          sessions={sessions.filter(
            (session) => session.stageId === stage._id
          )}
        />
      </div>
    </div>
  )
}

export default StageSettings
