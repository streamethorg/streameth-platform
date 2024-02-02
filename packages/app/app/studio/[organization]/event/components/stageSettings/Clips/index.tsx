'use client'
import { useEffect, useState } from 'react'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import CreateClipCard from './CreateClipCard'
import SessionCard from './SessionCard'
import { useNavigation } from '../../navigation/navigationContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  const { selectedStageSetting, setSelectedStageSetting } =
    useNavigation()

  if (selectedStageSetting !== 'clip') {
    return null
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="">
          <CardContent>
            <div className="text-2xl mb-4 text-center w-full">
              No sessions yet
            </div>
            <div className="flex flex-row space-x-2">
              <Button
                variant={'secondary'}
                className=""
                onClick={() => {
                  setSelectedStageSetting('settings')
                }}>
                Cancel
              </Button>
              <Button variant={'default'} className="w-full">
                Create new session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-row h-full gap-2">
      <div className="flex flex-col w-2/6 border-none rounded-none overflow-scroll h-full gap-2">
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
        <div className="flex flex-row space-x-2">
          <Button
            variant={'outline'}
            className=""
            onClick={() => {
              setSelectedStageSetting('settings')
            }}>
            Back to settings
          </Button>
          <Button variant={'default'} className="w-full">
            Create new session
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full overflow-scroll">
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
