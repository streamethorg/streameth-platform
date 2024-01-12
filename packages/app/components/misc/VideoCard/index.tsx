import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ISession } from 'streameth-server/model/session'
import Thumbnail from './thumbnail'
import { fetchEvent } from '@/lib/data'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import Link from 'next/link'

const VideoCard = async ({
  session,
  invertedColors,
}: {
  session: ISession
  invertedColors?: boolean
}) => {
  const event = await fetchEvent({
    event: session.eventId,
  })

  // Determine the classes based on invertedColors prop
  const headerClass = invertedColors ? 'bg-background text-white' : ''
  const descriptionClass = invertedColors
    ? 'text-white'
    : 'text-background'

  return (
    <div className="min-h-full w-full rounded-xl text-white uppercase">
      <Link
        href={`/watch?event=${session.eventId}&session=${session.id}`}>
        <Thumbnail session={session} fallBack={event.eventCover} />
      </Link>
      <CardHeader
        className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none ${headerClass}`}>
        <Link
          href={`/watch?event=${session.eventId}&session=${session.id}`}>
          <CardTitle
            className={`text-sm truncate ${descriptionClass}`}>
            {session.name}
          </CardTitle>
        </Link>
        <Link href={`/archive?event=${event.id}`}>
          <div className="flex flex-row items-center justify-start">
            <Image
              className="rounded-md mr-2"
              alt="logo"
              quality={80}
              src={getImageUrl('/events/' + event.logo)}
              height={24}
              width={24}
            />
            <CardDescription
              className={`text-xs truncate ${descriptionClass}`}>
              {event.name}
            </CardDescription>
          </div>
        </Link>
      </CardHeader>
    </div>
  )
}

export default VideoCard
