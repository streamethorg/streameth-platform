import { fetchAllSessions } from '@/lib/data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

export default async function Videos() {
  const videos = await fetchAllSessions({})

  if (!videos) return null

  return (
    <Card className="max-w-screen bg-transparent border-none ">
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map(({ name, start, coverImage, eventId }, index) => (
          <Link key={index} href={`/`}>
            <Card className="p-2 w-full h-full border-none">
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
                <CardHeader className="bg-background rounded mt-1">
                  <CardTitle className="truncate text-xl">
                    {name}
                  </CardTitle>
                  <CardDescription>
                    {new Date(start).toDateString()}
                    {eventId}
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
