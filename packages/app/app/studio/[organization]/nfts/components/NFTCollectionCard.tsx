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
      href={`/studio/${organization}/nfts/${nft._id}`}
      className="cursor-pointer rounded-xl border border-grey bg-secondary p-2">
      <Thumbnail imageUrl={nft.thumbnail} />

      <div className="flex items-start justify-between">
        <div
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}>
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
