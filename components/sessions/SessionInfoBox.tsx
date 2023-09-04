'use client'
import { ISession } from '@/server/model/session'
import ComponetCard from '../misc/ComponentCard'

const SessionInfoBox = ({ session }: { session: ISession }) => {

  if (!session) return null

  return (
    <ComponetCard title={session.name} date={new Date(session.start)}>
      <p className="text-main-text md:text-lg text-justify">{session.description}</p>
    </ComponetCard>
  )
}

export default SessionInfoBox
