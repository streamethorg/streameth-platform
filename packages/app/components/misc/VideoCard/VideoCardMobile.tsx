import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
} from '@/components/ui/card'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Link from 'next/link'
import Image from 'next/image'

const VideoCardMobile = ({
  session,
  showDate = true,
  link,
}: {
  session: IExtendedSession
  showDate?: boolean
  link: string
}) => {
  return (
    <div className="flex space-y-2 w-full min-h-full uppercase rounded-xl">
      <div className="flex-none my-auto w-1/4">
        <Link href={link}>
          {session.coverImage ? (
            <Image
              src={session.coverImage}
              alt="Session Cover"
              fill
            />
          ) : (
            <AspectRatio
              ratio={16 / 9}
              className="flex justify-center items-center w-full">
              <DefaultThumbnail />
            </AspectRatio>
          )}
        </Link>
      </div>
      <div className="flex-grow ml-4">
        <CardHeader className="p-1 mt-1 rounded shadow-none lg:p-2 lg:shadow-none">
          <Link href={link}>
            <CardTitle className="overflow-hidden text-sm capitalize hover:underline line-clamp-2">
              {session.name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex justify-between items-center">
              <CardDescription className="text-xs truncate">
                {formatDate(
                  new Date(session.createdAt as string),
                  'ddd. MMM. D, YYYY'
                )}
              </CardDescription>
            </div>
          )}
        </CardHeader>
      </div>
    </div>
  )
}

export default VideoCardMobile
