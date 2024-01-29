import React from 'react'
import { Card } from '@/components/ui/card'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
function SessionCard({
  session,
  selectedSession,
  setSelectedSession,
}: {
  session: ISessionModel
  selectedSession: ISessionModel | undefined
  setSelectedSession: (session: ISessionModel) => void
}) {
  return (
    <Card
      onClick={() => setSelectedSession(session)}
      key={session._id}
      className={`${
        selectedSession && selectedSession._id === session._id
          ? 'shadow-lg'
          : 'hover:shadow-lg'
      } cursor-pointer border  p-4 rounded-lg transition duration-200 ease-in-out`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {session.name}
        </h2>
        <div className="text-xs text-gray-600 mt-2">
          <p>{new Date(session.start).toLocaleString()}</p>
          <div className="flex flex-row space-x-2 items-center mt-1">
            {!session.assetId ? (
              <span className="bg-red-500 rounded-full w-3 h-3"></span>
            ) : (
              <span className="bg-green-500 rounded-full w-3 h-3"></span>
            )}
            <span className="font-medium">
              {session.assetId ? 'Video Available' : 'No Video'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SessionCard
