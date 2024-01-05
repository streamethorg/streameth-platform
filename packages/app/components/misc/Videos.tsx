import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { ISession } from 'streameth-server/model/session'

export default async function VideoGrid({
  videos,
  maxVideos,
  scroll,
}: {
  videos: ISession[]
  maxVideos?: number
  scroll?: boolean
}) {
  if (!videos) return null

  return (
    <div className="max-w-screen bg-transparent border-none ">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-1'
        }  md:grid md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {videos.map(
          ({ name, start, coverImage, eventId, id }, index) =>
            ({ maxVideos }) &&
            maxVideos &&
            index > maxVideos ? null : (
              <Link
                key={index}
                href={`/watch?event=${eventId}&session=${id}`}>
                <div
                  className={`${
                    scroll && 'w-[300px]'
                  } md:w-full h-full border-none bg-white`}>
                  <div className=" min-h-full rounded-xl text-white uppercase">
                    <div className="aspect-video relative">
                      <Image
                        className="rounded"
                        alt="Session image"
                        quality={80}
                        src={getImageUrl(`${coverImage}`)}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <CardHeader className="bg-white p-2 md:p-2 shadow-none md:shadow-none">
                      <CardTitle className=" text-black text-sm truncate">
                        {name}
                      </CardTitle>
                      <CardDescription>
                        {new Date(start).toDateString()}
                      </CardDescription>
                    </CardHeader>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  )
}
