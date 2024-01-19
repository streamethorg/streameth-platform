import React from 'react'
import { ISession } from 'streameth-server/model/session'

const SessionCard = ({
  session,
  onClick,
}: {
  session: ISession
  onClick: () => void
}) => {
  return (
    <div>
      <p>{session.name}</p>
      {session.assetId ? (
        <div className="flex flex-row">
          <p className="bg-red-600 rounded-full w-3 h-3" />
          No video
        </div>
      ) : (
        <div className="flex flex-row">
          <p className=" bg-green-600 rounded-full w-3 h-3" />
          has video
        </div>
      )}
    </div>
  )
}
