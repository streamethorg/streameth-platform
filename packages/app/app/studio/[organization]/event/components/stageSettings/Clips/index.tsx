'use client'
import { useState } from 'react'

import { Card, CardFooter } from '@/components/ui/card'
import { ISession } from 'streameth-server/model/session'
import { IStage } from 'streameth-server/model/stage'
import CreateClipCard from './CreateClipCard'
import SessionCard from './SessionCard'
import { useNavigation } from '../navigation/navigationContext'
const Clips = ({
  stage,
  sessions,
}: {
  stage: IStage
  sessions: ISession[]
}) => {
  const [selectedSession, setSelectedSession] = useState<
    ISession | undefined
  >()

  const { selectedSetting } = useNavigation()

  if (selectedSetting !== 'clip') {
    return null
  }

  return (
    <div className="flex flex-row h-full">
      <Card className="flex flex-col w-1/3 border-none rounded-none overflow-scroll h-full gap-2 p-2">
        <div className="text-2xl">Stage sessions</div>
        <div className="w-full h-full overflow-scroll">
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
        <CardFooter>Create new Clip</CardFooter>
      </Card>
      <div className="flex flex-col w-2/3 p-2">
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
