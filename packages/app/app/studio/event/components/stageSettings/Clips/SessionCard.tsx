import React from 'react'
import ISession from 'streameth-server/model/session'
function SessionCard({
  session,
  selectedSession,
  setSelectedSession,
}: {
  session: ISession
  selectedSession: ISession | undefined
  setSelectedSession: (session: ISession) => void
}) {
  return (
    <div
      onClick={() => setSelectedSession(session)}
      key={session.id}
      className={`${
        selectedSession && selectedSession.id === session.id
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
    </div>
  )
}

export default SessionCard
