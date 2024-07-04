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
    <div className="min-h-full w-full rounded-xl uppercase">
      <Thumbnail imageUrl={session.coverImage} fallBack={imageUrl} />
      <CardHeader
        className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none ${headerClass}`}>
        <CardTitle className={`truncate text-sm ${descriptionClass}`}>
          {session.name}
        </CardTitle>
        {event && (
          <div className="flex flex-row items-center justify-start">
            <Image
              className="mr-2 rounded-md"
              alt="logo"
              quality={80}
              src={event.logo!}
              height={24}
              width={24}
            />
            <CardDescription
              className={`truncate text-xs ${descriptionClass}`}>
              {event?.name}
            </CardDescription>
          </div>
        )}
      </CardHeader>
    </div>
  )
}

export default VideoCard
