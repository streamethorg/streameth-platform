'use client'
import { ISession } from '@/server/model/session'
import SpeakerIconList from '../speakers/SpeakerIconList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
const ScheduleCardModal = ({ session }: { session: ISession }) => {
  const [showGoToStage, setShowGoToStage] = useState(false)
  useEffect(() => {
    const url = window.location.href
    setShowGoToStage(!url.includes('stage'))
  }, [])

  return (
    <div className="flex flex-col p-4 border-b-2 border-b-accent">
      {showGoToStage && (
        <Link
          href={`${session.eventId}/stage/${session.stageId}`}
          className="text-xs border-accent border-2 text-accent rounded ml-auto p-2 font-bold mb-4 hover:bg-accent hover:text-white">
          Go to Stage
        </Link>
      )}
      <h1 className="text-lg text-main-text font-bold text-center">{session.name}</h1>
      <div className="flex flex-row justify-center items-center space-x-3 p-2">
        <p className="text-secondary-text">{new Date(session.start).toTimeString().slice(0, 5)}</p>-
        <p className="text-secondary-text">{new Date(session.end).toTimeString().slice(0, 5)}</p>
      </div>
      <p className="py-4">{session.description}</p>
      <SpeakerIconList speakers={session.speakers} />
    </div>
  )
}

export default ScheduleCardModal
