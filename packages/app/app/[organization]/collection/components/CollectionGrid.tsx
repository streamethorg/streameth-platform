import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { Button } from '@/components/ui/button'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { fetchSession } from '@/lib/services/sessionService'
import { fetchStage } from '@/lib/services/stageService'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { formatDate } from '@/lib/utils/time'
import Link from 'next/link'
import React from 'react'

const CollectionGrid = async ({ link = '#', video }) => {
  let session
  if (video.type === 'video') {
    session = await fetchSession({
      session: video.sessionId,
    })
  } else {
    session = await fetchStage({
      stage: video.stageId,
    })
  }
  //   console.log('CollectionGrid1', session)

  if (!session) return null
  return (
    <div className="w-full min-h-full uppercase rounded-xl flex flex-col">
      <Link className="w-full h-full" href={link}>
        {session?.coverImage ? (
          <Thumbnail imageUrl={session?.coverImage} />
        ) : (
          <div className="w-full h-full aspect-video">
            <DefaultThumbnail />
          </div>
        )}
      </Link>
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <Link href={link}>
            <CardTitle
              className={`text-sm capitalize line-clamp-2 overflow-hidden  hover:underline `}>
              {session.name}
            </CardTitle>
          </Link>

          <div className="flex justify-between items-center">
            <CardDescription className={`text-xs truncate `}>
              {formatDate(
                new Date(session.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </div>
      <Button variant="outline" className="w-fit">
        Collect Video
      </Button>
    </div>
  )
}

export default CollectionGrid
