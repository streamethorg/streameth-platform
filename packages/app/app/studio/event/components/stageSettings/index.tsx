'use client'
import React, { useState } from 'react'
import { IStage } from 'streameth-server/model/stage'
import StageAccordion from './navigation/stageAccordion'
import StreamConfig from './StreamConfig'
import { ISession } from 'streameth-server/model/session'
import Clips from './Clips'
const StageSettings = ({
  stages,
  sessions,
  selectedStage,
}: {
  sessions: ISession[]
  stages: IStage[]
  selectedStage: string
}) => {
  const [stage] = stages.filter((stage) => stage.id === selectedStage)
  const [selectedSetting, setSelectedSetting] = useState('settings')

  return (
    <>
      <div className="w-1/6 min-w-[300px] h-full border-r">
        <StageAccordion
          stages={stages}
          selectedSetting={selectedSetting}
          setSelectedSetting={setSelectedSetting}
        />
      </div>
      <div className="w-full h-full">
        {stage && selectedSetting === 'settings' && (
          <StreamConfig stage={stage} />
        )}
        {stage && selectedSetting === 'clip' && (
          <Clips
            stage={stage}
            sessions={sessions.filter(
              (session) => session.stageId === stage.id
            )}
          />
        )}
      </div>
    </>
  )
}

export default StageSettings
