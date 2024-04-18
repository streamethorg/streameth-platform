import React from 'react'
import Image from 'next/image'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'
import { OrganizationPageProps } from '@/lib/types'
import {
  fetchNFTCollection,
  fetchOrganizationNFTCollections,
} from '@/lib/services/nftCollectionService'
import { formatDate } from '@/lib/utils/time'
import { Button } from '@/components/ui/button'
import CollectionGrid from './components/CollectionGrid'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'

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
  //   const collections = await fetchOrganizationNFTCollections({
  //     organizationId: organization._id,
  //   })
  console.log(collection, searchParams.collectionId)
  return (
    <div>
      <div className="hidden md:block max-h-[200px] h-full aspect-video w-full">
        {organization.banner ? (
          <Image
            src={organization.banner}
            alt="banner"
            quality={100}
            objectFit="cover"
            className="rounded-xl"
            fill
            priority
          />
        ) : (
          <div className=" bg-gray-300 rounded-xl md:rounded-none max-h-[200px] h-full">
            <StreamethLogoWhite />
          </div>
        )}
      </div>
      <div className="w-full max-w-7xl m-auto p-4">
        <div className="flex items-center gap-3">
          <div className="w-[250px] h-[250px]">
            {collection.thumbnail ? (
              <Thumbnail imageUrl={collection.thumbnail} />
            ) : (
              <div className="w-full h-full aspect-video">
                <DefaultThumbnail />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl">{collection.name}</h4>
            <p>{collection.description}</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <p>
                Created{' '}
                {formatDate(
                  new Date(collection.createdAt),
                  'MMM. YYYY'
                )}
              </p>
              <p>{collection.videos?.length} Unique Items</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant={'primary'}>Collect All Videos</Button>
              <Button variant={'outline'}>Share Collection</Button>
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-2 lg:grid md:grid-cols-3 lg:grid-cols-3 gap-8 gap-x-4">
          {collection?.videos?.map((video) => (
            <CollectionGrid video={video} key={collection._id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection
