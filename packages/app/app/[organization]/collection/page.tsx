import React from 'react'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import { OrganizationPageProps } from '@/lib/types'
import { fetchNFTCollection } from '@/lib/services/nftCollectionService'
import { formatDate } from '@/lib/utils/time'
import CollectionGrid from './components/CollectionGrid'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import ChannelBanner from '../components/ChannelBanner'
import ShareButton from '@/components/misc/interact/ShareButton'
import Image from 'next/image'
import CollectVideButton from '@/components/sessions/CollectVideButton'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'

const Collection = async ({
  params,
  searchParams,
}: OrganizationPageProps) => {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  const collection = await fetchNFTCollection({
    collectionId: searchParams.collectionId,
  })
  if (!organization || !collection) {
    return notFound()
  }

  return (
    <div>
      <ChannelBanner organization={organization} />
      <div className="w-full max-w-7xl m-auto p-4 space-y-8">
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="relative w-1/3 aspect-square">
            <Thumbnail imageUrl={collection.thumbnail} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl">{collection.name}</h4>
            <p>{collection.description}</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <p>
                Created{' '}
                {formatDate(
                  new Date(collection.createdAt as string),
                  'MMM. YYYY'
                )}
              </p>
              <p>{collection.videos?.length} Unique Items</p>
            </div>
            <div className="flex items-center gap-4">
              <CollectVideButton nftCollection={collection} all />
              <ShareButton shareFor="Collection" />
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-2 lg:grid md:grid-cols-3 lg:grid-cols-3 gap-8 gap-x-4">
          {collection?.videos?.map((video) => (
            <CollectionGrid
              video={video}
              key={collection._id}
              nftCollection={collection}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection
