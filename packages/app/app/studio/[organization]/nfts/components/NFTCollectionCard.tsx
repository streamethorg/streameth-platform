import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IExtendedNftCollections } from '@/lib/types'
import { EllipsisVertical } from 'lucide-react'
import React from 'react'
import ShareVideoNFT from '../create/components/ShareVideoNFT'
import Link from 'next/link'

const NFTCollectionCard = ({
  nft,
  organization,
}: {
  nft: IExtendedNftCollections
  organization: string
}) => {
  return (
    <Link
      href={`/${organization}/collection?collectionId=${nft._id}`}
      className="border border-grey bg-secondary rounded-xl p-2 cursor-pointer">
      <Thumbnail
        imageUrl={nft.thumbnail}
        fallBack="/images/videoPlaceholder.png"
      />

      <div className="flex justify-between items-start">
        <div
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <p className={`line-clamp-1 font-medium`}>{nft.name}</p>

          <p className="text-sm text-muted-foreground">
            {nft?.videos?.length} item
            {nft?.videos?.length
              ? nft?.videos?.length < 1
                ? ''
                : 's'
              : ''}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="z-10">
            <EllipsisVertical className="mt-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ShareVideoNFT
                collectionId={nft._id}
                organization={organization}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  )
}

export default NFTCollectionCard
