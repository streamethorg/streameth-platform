'use client'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { Card } from '@/components/ui/card'
import { IExtendedSession } from '@/lib/types'
import { Button } from '@/components/ui/button'
import CreateSession from '../../../../library/create/CreateSession'
import Link from 'next/link'
const SessionList = ({
  sessions,
  eventId,
  organizationId,
  stageId,
  organizationSlug,
}: {
  eventId: string
  organizationId: string
  stageId: string
  organizationSlug: string
  sessions: IExtendedSession[]
}) => {
  const { handleTermChange, searchParams } = useSearchParams()
  const selectedSession = searchParams.get('selectedSession')

  return (
    <div className="w-full flex flex-col h-full ">
      <div className="flex flex-col flex-grow overflow-auto space-y-2">
        {sessions.length > 0 &&
          sessions.map((session) => (
            <Card
              onClick={() => {
                handleTermChange([
                  {
                    key: 'selectedSession',
                    value: session._id,
                  },
                  {
                    key: 'replaceAsset',
                    value: '',
                  },
                ])
              }}
              key={session._id}
              className={`${
                selectedSession === session._id
                  ? 'shadow-lg border-primary border-2'
                  : 'hover:shadow-lg shadow-none border border-outline'
              } cursor-pointer p-4 rounded-lg transition duration-200 ease-in-out`}>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {session.name}
                </h2>
                <div className="text-xs text-gray-600 mt-2">
                  <p>{new Date(session.start).toString()}</p>
                  <div className="flex flex-row space-x-2 items-center mt-1">
                    {!session.assetId ? (
                      <span className="bg-red-500 rounded-full w-3 h-3"></span>
                    ) : (
                      <span className="bg-green-500 rounded-full w-3 h-3"></span>
                    )}
                    <span className="font-medium">
                      {session.assetId
                        ? 'Video Available'
                        : 'No Video'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
      <div className="flex flex-row space-x-2 mt-auto w-full">
        <Link href={`/studio/${organizationSlug}/event/${eventId}`}>
          <Button variant={'outline'} className="">
            Back to settings
          </Button>
        </Link>
        <CreateSession
          stageId={stageId}
          eventId={eventId}
          organizationId={organizationId}
        />
      </div>
    </div>
  )
}

export default SessionList
