'use client'
import { useEffect, useState } from 'react'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Thumbnail from './thumbnail'
import Image from 'next/image'
import { IExtendedSession, IExtendedEvent } from '@/lib/types'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { generateThumbnailAction } from '@/lib/actions/sessions'

const VideoCard = ({
  session,
  invertedColors,
  event,
}: {
  session: IExtendedSession
  invertedColors?: boolean
  event?: IExtendedEvent
}) => {
  const headerClass = invertedColors ? ' ' : ''
  const descriptionClass = invertedColors ? '' : ''
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    generateThumbnailAction(session).then(
      (url) => url && setImageUrl(url)
    )
  }, [])

  return (
    <div className="min-h-full w-full rounded-xl  uppercase">
      <Thumbnail imageUrl={session.coverImage} fallBack={imageUrl} />
      <CardHeader
        className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none ${headerClass}`}>
        <CardTitle className={`text-sm truncate ${descriptionClass}`}>
          {session.name}
        </CardTitle>
        {event && (
          <div className="flex flex-row items-center justify-start">
            <Image
              className="rounded-md mr-2"
              alt="logo"
              quality={80}
              src={event.logo!}
              height={24}
              width={24}
            />
            <CardDescription
              className={`text-xs truncate ${descriptionClass}`}>
              {event?.name}
            </CardDescription>
          </div>
        )}
      </CardHeader>
    </div>
  )
}

export default VideoCard
