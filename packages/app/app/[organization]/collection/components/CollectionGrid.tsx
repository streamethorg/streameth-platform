import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import CollectVideButton from '@/components/sessions/CollectVideButton'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { fetchSession } from '@/lib/services/sessionService'
import { fetchStage } from '@/lib/services/stageService'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import {
  IExtendedNftCollections,
  IExtendedSession,
} from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import Link from 'next/link'
import React from 'react'

const CollectionGrid = async ({
  video,
  nftCollection,
  organizationSlug,
}: {
  video: { type?: string; sessionId?: string; stageId?: string }
  nftCollection: IExtendedNftCollections
  organizationSlug?: string
}) => {
  let session
  let stage
  if (video.type === 'video') {
    session = await fetchSession({
      session: video.sessionId as string,
    })
  } else {
    stage = await fetchStage({
      stage: video.stageId as string,
    })
  }
  const collection = session || stage
  const collectionImage = session?.coverImage || stage?.thumbnail

  if (!collection) return null
  const link = `/${organizationSlug}/${
    video.type === 'video' ? 'watch?session' : 'livestream?stage'
  }=${collection?._id?.toString()}`

  return (
    <div className="w-full min-h-full uppercase rounded-xl flex flex-col">
      <Link className="w-full h-full" href={link}>
        <Thumbnail imageUrl={collectionImage!} />
      </Link>
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <Link href={link}>
            <CardTitle
              className={`text-sm capitalize line-clamp-2 overflow-hidden  hover:underline `}>
              {collection?.name}
            </CardTitle>
          </Link>

          <div className="flex justify-between items-center">
            <CardDescription className={`text-xs truncate `}>
              {formatDate(
                new Date(collection?.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </div>
      <CollectVideButton
        variant="outline"
        video={collection as IExtendedSession}
        nftCollection={nftCollection}
      />
    </div>
  )
}

export default CollectionGrid
