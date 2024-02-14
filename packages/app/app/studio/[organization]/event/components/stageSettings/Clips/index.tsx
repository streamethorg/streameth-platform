'use client'
import { useCallback, useEffect, useState } from 'react'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import CreateClipCard from './CreateClipCard'
import SessionCard from './SessionCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IExtendedSession } from '@/lib/types'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

const Clips = ({
  stage,
  sessions,
}: {
  stage: IStageModel
  sessions: IExtendedSession[]
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [selectedSession, setSelectedSession] = useState<
    IExtendedSession | undefined
  >()

  useEffect(() => {
    setSelectedSession(undefined)

    return () => {
      setSelectedSession(undefined)
    }
  }, [stage, sessions])

  const stageSetting = searchParams.get('stageSetting')
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  if (stageSetting !== 'clip') {
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
                onClick={() => {
                  router.push(
                    pathname +
                      '?' +
                      createQueryString('stageSetting', 'settings')
                  )
                  // setstageSetting('settings')
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
      <div className="flex flex-col w-2/6 border-none rounded-none overflow-auto h-full gap-2">
        <div className="w-full h-full overflow-auto space-y-2">
          {sessions.length > 0 &&
            sessions.map((session) => (
              <SessionCard
                key={session._id}
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
              router.push(
                pathname +
                  '?' +
                  createQueryString('stageSetting', 'settings')
              )
              // setstageSetting('settings')
            }}>
            Back to settings
          </Button>
          <Button variant={'default'} className="w-full">
            Create new session
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full overflow-auto">
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
