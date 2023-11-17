'use client'
import DownloaderIcon from '@/app/assets/icons/DownloaderIcon'
import { IEvent } from '@/server/model/event'
import { ISession } from '@/server/model/session'

import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
        <Link
          href={session?.videoUrl as string}
          className="cursor-pointer ml-3 text-white font-bold hover:bg-base">
          <DownloaderIcon />
        </Link>
      )}
    </div>
  )
}

export default ActionsComponent
