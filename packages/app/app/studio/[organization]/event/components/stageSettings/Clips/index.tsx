'use client'
import { useEffect, useState } from 'react'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import CreateClipCard from './CreateClipCard'
import SessionCard from './SessionCard'
import { useNavigation } from '../../navigation/navigationContext'
import { Button } from '@/components/ui/button'

const Clips = ({
  stage,
  sessions,
}: {
  stage: IStageModel
  sessions: ISessionModel[]
}) => {
  const [selectedSession, setSelectedSession] = useState<
    ISessionModel | undefined
  >()

  useEffect(() => {
    setSelectedSession(undefined)

    return () => {
      setSelectedSession(undefined)
    }
  }, [stage, sessions])

  const { selectedStageSetting } = useNavigation()

  if (selectedStageSetting !== 'clip') {
    return null
  }

  return (
    <div className="flex flex-row h-full gap-2">
      <div className="flex flex-col w-1/3 border-none rounded-none overflow-scroll h-full gap-2">
        <div className="w-full h-full overflow-scroll space-y-2">
          {sessions.length > 0 &&
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
              />
            ))}
        </div>
        <Button variant={'default'} className="w-full">
          Create new Clip
        </Button>
      </div>
      <div className="flex flex-col w-2/3">
        {selectedSession ? (
          <CreateClipCard stage={stage} session={selectedSession} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl">Select a session</div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Clips
