import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Image from 'next/image'
import React from 'react'
import CreateNFTCollectionModal from './components/CreateNFTCollectionModal'
import { fetchOrganizationNFTCollections } from '@/lib/services/nftCollectionService'
import { fetchOrganization } from '@/lib/services/organizationService'
import NFTCollectionCard from './components/NFTCollectionCard'
import MintNftSort from './components/MintNftSort'
import { sortArray } from '@/lib/utils/utils'
import { IExtendedNftCollections } from '@/lib/types'

const NFT = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { type: string; sort: string }
}) => {
  const { type } = searchParams
  const organizationId = (
    await fetchOrganization({ organizationSlug: params.organization })
  )?._id
  if (!organizationId) return null
  const nftCollections = sortArray(
    await fetchOrganizationNFTCollections({
      organizationId,
    }),
    searchParams.sort || 'desc_alpha'
  )

  return (
    <div className="flex h-full flex-col bg-white">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/nftBg.svg)`,
          backgroundPositionX: 'center',
        }}
        className="rounded-none border-none bg-black bg-cover bg-no-repeat p-4 text-white shadow-none">
        <CardHeader>
          <CardTitle>Create Epic NFT Collection</CardTitle>
          <CardDescription className="max-w-[400px] text-white">
            Create NFT collection from your livestream on Base Chain.
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <CreateNFTCollectionModal type={type} />
        </CardFooter>
      </Card>

      <div className="flex h-full flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold">Your Collections</p>
          <MintNftSort />
        </div>

        {nftCollections.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {nftCollections.map((nft) => (
              <NFTCollectionCard
                organization={params.organization}
                key={nft._id}
                nft={nft as IExtendedNftCollections}
              />
            ))}
          </div>
        ) : (
          <div className="m-auto flex h-96 flex-col items-center justify-center bg-white">
            <Image
              src="/images/empty-box.png"
              width={150}
              height={150}
              alt="empty nft"
            />
            <CardTitle className="mt-4 text-2xl font-semibold">
              No NFT Collection
            </CardTitle>
            <CardDescription>
              Create your an NFT collection to get started!
            </CardDescription>
            <div className="mt-6 w-fit">
              <CreateNFTCollectionModal type={type} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NFT
