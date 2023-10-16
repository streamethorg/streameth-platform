'use client'
import { ISession } from '@/server/model/session'
import ComponetCard from '../misc/ComponentCard'

const SessionInfoBox = ({ session, showDate }: { session: ISession; showDate?: boolean }) => {
  if (!session) return null
  const { name: title, description } = session
  return (
    <div className={`p-2 px-4 rounded  w-full shadow bg-base ${!description && ''}`}>
      <div className="flex flex-col">
        <div className="w-full text-left text-md lg:text-lg font-medium text-main-text ">{title}</div>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

export default SessionInfoBox
