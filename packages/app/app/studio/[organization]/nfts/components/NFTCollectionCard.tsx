import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import ShareButton from '@/components/misc/interact/ShareButton'
import { CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IExtendedNftCollections } from '@/lib/types'
import { EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const NFTCollectionCard = ({
  nft,
}: {
  nft: IExtendedNftCollections
}) => {
  return (
    <div className="border border-grey bg-secondary rounded-xl p-2">
      {/* {nft.thumbnail ? (
        // <div className="w-full  bg-grey rounded-xl">
          {/* <Image
            src={nft.thumbnail}
            width={150}
            height={150}
            alt="nft thumbnail"
            style={{ objectFit: 'contain' }}
            className="object-contain w-full h-full"
          /> */}
      <Thumbnail
        imageUrl={nft.thumbnail}
        // fallBack="/images/videoPlaceholder.png"
      />

      <div className="flex justify-between items-start">
        <div
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <p className={`line-clamp-1 font-medium`}>{nft.name}</p>

          <p className="text-sm text-muted-foreground">
            {nft.videos?.length} item
            {nft.videos?.length < 1 ? '' : 's'}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="z-10">
            <EllipsisVertical className="mt-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ShareButton />
            </DropdownMenuItem>
            {/* {DropdownMenuItems} */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default NFTCollectionCard
