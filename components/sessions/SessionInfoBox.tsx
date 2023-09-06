'use client'
import { ISession } from '@/server/model/session'
import ComponetCard from '../misc/ComponentCard'

const SessionInfoBox = ({ session, showDate }: { session: ISession; showDate?: boolean }) => {
  if (!session) return null

  return (
    <div className="w-full">
      <ComponetCard title={session.name} date={showDate ? new Date(session.start) : undefined}>
        <p className="text-main-text md:text-lg text-justify">{session.description}</p>
      </ComponetCard>
    </div>
  )
}

export default SessionInfoBox
