import Link from 'next/link'
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

// TODO: inverted colors
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
  return (
    <div className=" min-h-full rounded-xl text-white uppercase">
      <Thumbnail session={session} />
      <CardHeader className=" rounded p-1 mt-1 md:p-2 shadow-none md:shadow-none">
        <CardTitle className="text-background  text-sm truncate">
          {session.name}
        </CardTitle>
        <CardDescription className="lowercase text-sm truncate ">
          <Link href={`/archive?event=${event.id}`}>
            <div className="flex flex-row hover:underline hover:text-wite">
              {event?.logo ? (
                <Image
                  className="rounded m-auto"
                  alt={event.name.slice(0, 2).toUpperCase()}
                  quality={80}
                  src={getImageUrl(event.logo)}
                  height={24}
                  width={24}
                />
              ) : (
                <p>{event.name.slice(0, 2).toUpperCase()}</p>
              )}
              <p className="flex flex-grow px-2">{event.name}</p>
            </div>
          </Link>
        </CardDescription>
      </CardHeader>
    </div>
  )
}

export default VideoCard
