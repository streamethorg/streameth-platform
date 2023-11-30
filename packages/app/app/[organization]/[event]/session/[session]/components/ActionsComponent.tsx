'use client'
import DownloaderIcon from '@/app/assets/icons/DownloaderIcon'


import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import VideoDownload from './VideoDownload'
import { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { ISession } from '../../../../../../../server/model/session'
import { IEvent } from '../../../../../../../server/model/event'

const ActionsComponent = ({
  title,
  goBackButton = false,
  children,
  event,
  session,
}: {
  title?: string
  goBackButton?: boolean
  children: React.ReactNode
  event?: IEvent
  session?: ISession
}) => {
  const { openModal, closeModal } = useContext(ModalContext)
  const router = useRouter()

  const onBackClick = () => {
    router.back()
  }
  return (
    <div className="flex flex-row pb-4 items-center bg-black rounded-t-xl md:w-full text-white ">
      {goBackButton && (
        <ArrowUturnLeftIcon
          className="p-1 h-8 w-8 cursor-pointer text-accent text-white"
          onClick={onBackClick}
        />
      )}
      {title && (
        <h1 className="text-lg md:text-xl text-white uppercase ">
          {title}
        </h1>
      )}
      {children}
      {event?.enableVideoDownloader && (
        <button
          onClick={() => {
            openModal(
              <VideoDownload
                closeModal={closeModal}
                title={session?.name}
                playbackId={session?.playbackId}
              />
            )
          }}
          className="cursor-pointer ml-3 text-white font-bold hover:bg-base">
          <DownloaderIcon />
        </button>
      )}
    </div>
  )
}

export default ActionsComponent
