'use client'
import { ISession } from '@/server/model/session'
import ComponetCard from '../misc/ComponentCard'

const SessionInfoBox = ({ session }: { session: ISession | undefined }) => {
  if (!session) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>There are no sessions scheduled for this stage.</p>
      </div>
    )
  }
  return (
    <ComponetCard title={session.name} date={session.start}>
      <p className="text-main-text md:text-lg text-justify">{session.description}</p>
    </ComponetCard>
  )
}

export default SessionInfoBox
