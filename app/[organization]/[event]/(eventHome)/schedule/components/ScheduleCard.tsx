'use client'
import { ISession } from '@/server/model/session'
import { ModalContext } from '@/components/context/ModalContext'
import { useContext } from 'react'
import ScheduleCardModal from './ScheduleCardModal'

const ScheduleCard = ({
  session,
  showTime = false,
  speakers = false,
}: {
  session: ISession
  showTime?: boolean
  speakers?: boolean
}) => {
  const { openModal } = useContext(ModalContext)
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now() // TODO: Test Active

  return (
    <div
      className="bg-black/20 flex space-y-3 flex-col w-full h-full   rounded p-2 md:p-2 text-white cursor-pointer transition-colors"
      onClick={() => {
        openModal(<ScheduleCardModal session={session} />)
      }}>
      <div className="border-l border-white  hover:border-l-2 flex flex-col px-2 rounded-tr rounded-br w-full h-full">
        {showTime && (
          <p className="text-main-text text-sm uppercase py-1">
            {new Date(session.start)
              .getHours()
              .toString()
              .padStart(2, '0') +
              ':' +
              new Date(session.start)
                .getMinutes()
                .toString()
                .padStart(2, '0')}
            -
            {new Date(session.end)
              .getHours()
              .toString()
              .padStart(2, '0') +
              ':' +
              new Date(session.end)
                .getMinutes()
                .toString()
                .padStart(2, '0')}
          </p>
        )}
        <p className="flex text-ellipsis text-main-text text-sm lg:text-md">
          {session.name}
        </p>
        {speakers && (
          <div className="flex py-1 items-center flex-row space-x-2 overflow-x-scroll mt-auto">
            {session.speakers.map((speaker) => (
              <p
                key={speaker.id}
                className="text-sm text-main-text border p-1 px-2 rounded-full whitespace-nowrap ">
                {speaker.name}
              </p>
            ))}
          </div>
        )}
        {isActive && (
          <p className="text-bold text-red-500 ml-auto animate-pulse">
            Live
          </p>
        )}
      </div>
    </div>
  )
}

export default ScheduleCard
