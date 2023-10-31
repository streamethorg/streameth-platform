'use client'
import { ISession } from '@/server/model/session'
import SpeakerIconList from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerIconList'
import { useEffect, useState, useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { LoadingContext } from '@/components/context/LoadingContext'
import { useRouter } from 'next/navigation'

const ScheduleCardModal = ({ session }: { session: ISession }) => {
  const [showGoToStage, setShowGoToStage] = useState(false)
  const { closeModal } = useContext(ModalContext)
  const { setIsLoading } = useContext(LoadingContext)
  const router = useRouter()

  useEffect(() => {
    const url = window.location.href
    setShowGoToStage(!url.includes('stage'))
  }, [])

  const handleGoToStage = () => {
    setIsLoading(true)
    closeModal()
    router.push(`stage/${session.stageId}`)
  }

  return (
    <div className="flex flex-col space-y-4 p-4  text-white w-full bg-base md:max-w-4xl rounded-xl">
      <div className="flex flex-col bg-base p-4 rounded-xl">
        <h1 className="text-lg  font-bold ">{session.name}</h1>
        <span className=" flex flex-row text-white">
          {new Date(session.start).toDateString()}{' '}
          {new Date(session.start).toTimeString().slice(0, 5)} -{' '}
          {new Date(session.end).toTimeString().slice(0, 5)}
        </span>
      </div>
      {session.description && (
        <p className="flex flex-col bg-base p-4 rounded-xl">
          {session.description}
        </p>
      )}

      <p className="flex flex-row flex-wrap">
        <SpeakerIconList speakers={session.speakers} />
      </p>
      {showGoToStage && (
        <div
          onClick={handleGoToStage}
          className="border text-lg  text-white cursor-pointer text-accent rounded-xl ml-auto p-2 font-bold mb-4 hover:bg-accent hover:text-white">
          Go to Stream
        </div>
      )}
    </div>
  )
}

export default ScheduleCardModal
