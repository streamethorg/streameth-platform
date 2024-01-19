'use client'
import { useState } from 'react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ISession } from 'streameth-server/model/session'
import IStage from 'streameth-server/model/stage'
import CreateClipCard from './CreateClipCard'
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

  return (
    <div className="flex flex-row h-full">
      <Card className="flex flex-col w-1/3 border-none rounded-none overflow-scroll h-full gap-2 p-2">
        {sessions.length > 0 &&
          sessions.map((session) => (
            <Card
              onClick={() => {
                setSelectedSession(session)
              }}
              key={session.id}
              className={`${
                selectedSession && selectedSession.id === session.id
                  ? 'border-primary'
                  : 'hover:bg-accent'
              } cursor-pointer border-b text-sm  flex flex-col
              `}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {session.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  <p>{new Date(session.start).toLocaleString()}</p>
                  {!session.assetId ? (
                    <div className="flex flex-row space-x-1">
                      <p className="bg-red-600 rounded-full w-3 h-3" />
                      No video
                    </div>
                  ) : (
                    <div className="flex flex-row space-x-1">
                      <p className=" bg-green-600 rounded-full w-3 h-3" />
                      has video
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
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
