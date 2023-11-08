'use client'
import { ISession } from '@/server/model/session'

const SessionInfoBox = ({
  session,
  showDate,
}: {
  session: ISession
  showDate?: boolean
}) => {
  if (!session) return null
  const { name: title, description } = session
  return (
    <div
      className={`p-2 px-4 rounded-xl w-full shadow bg-base ${
        !description && ''
      }`}>
      <div className="flex flex-col">
        <div className="w-full text-left text-md lg:text-xl mb-2 font-medium text-main-text ">
          {title}
        </div>
        {description && (
          <p className="text-main-text">{description}</p>
        )}
      </div>
    </div>
  )
}

export default SessionInfoBox
