'use client'
import StreamConfig from './StreamConfig'
import Clips from './Clips'
import { useNavigation } from '../navigation/navigationContext'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
const StageSettings = ({
  stages,
  sessions,
}: {
  stages: IStageModel[]
  sessions: ISessionModel[]
}) => {
  const { selectedStage, selectedSetting } = useNavigation()

  if (selectedSetting !== 'stages') return null

  const stage =
    stages.filter((stage) => stage._id === selectedStage)[0] ||
    stages[0]

  return (
    <div className="w-full h-full">
      <div className="p-2 bg-secondary h-full">
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
