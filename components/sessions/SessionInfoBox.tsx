'use client'
import { ISession } from '@/server/model/session'
import ComponetCard from '../misc/ComponentCard'

const SessionInfoBox = ({ session, showDate }: { session: ISession; showDate?: false }) => {
  if (!session) return null

  return (
    <ComponetCard title={session.name} date={showDate ? new Date(session.start) : undefined}>
      <p className="text-main-text md:text-lg text-justify">{session.description}</p>
    </ComponetCard>
  )
}

export default SessionInfoBox
