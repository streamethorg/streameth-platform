import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { fetchAllSessions } from '@/lib/data'

export default async function RelatedVideos({
  event,
}: {
  event: string
}) {
  const videos = (
    await fetchAllSessions({
      event: event,
      onlyVideos: true,
      limit: 5,
    })
  ).sessions

  return (
    <div className="max-w-screen bg-transparent border-none ">
      <div className="grid grid-cols-1 gap-4">
        {videos.map(
          ({ name, start, coverImage, id, eventId }, index) => (
            <Link
              key={index}
              href={`/watch?event=${eventId}&session=${id}`}>
              <div className={` md:w-full h-full border-none `}>
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
                  <CardHeader className=" p-2 md:p-2 shadow-none md:shadow-none">
                    <CardTitle className=" text-sm truncate">
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
