import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'

import Thumbnail from './thumbnail'
import Image from 'next/image'
import Link from 'next/link'
import { fetchEvent } from '@/lib/data'
import { archivePath } from '@/lib/utils/utils'

const VideoCard = async ({
  session,
  invertedColors,
}: {
  session: ISessionModel
  invertedColors?: boolean
}) => {
  const event = await fetchEvent({
    eventId: `${session.eventId}`,
  })

  const headerClass = invertedColors ? ' ' : ''
  const descriptionClass = invertedColors ? '' : ''

  return (
    <div className="min-h-full w-full rounded-xl  uppercase">
      <Link
        href={`/watch?event=${session.eventSlug}&session=${session._id}`}>
        <Thumbnail
          imageUrl={session.coverImage}
          fallBack={event?.eventCover}
        />
      </Link>
      <CardHeader
        className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none ${headerClass}`}>
        <Link
          href={`/watch?event=${session.eventSlug}&session=${session._id}`}>
          <CardTitle
            className={`text-sm truncate ${descriptionClass}`}>
            {session.name}
          </CardTitle>
        </Link>
        {event && (
          <Link href={archivePath({ event: session.eventSlug })}>
            <div className="flex flex-row items-center justify-start">
              <Image
                className="rounded-md mr-2"
                alt="logo"
                quality={80}
                src={event.logo}
                height={24}
                width={24}
              />
              <CardDescription
                className={`text-xs truncate ${descriptionClass}`}>
                {event?.name}
              </CardDescription>
            </div>
          </Link>
        )}
      </CardHeader>
    </div>
  )
}

export default VideoCard
