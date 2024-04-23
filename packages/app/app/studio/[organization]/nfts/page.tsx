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
    searchParams.sort
  )

  return (
    <div className="flex flex-col bg-white h-full">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/nftBg.jpg)`,
        }}
        className="shadow-none bg-cover bg-black text-white bg-no-repeat p-4 border-none">
        <CardHeader>
          <CardTitle>Create Epic NFT Collection</CardTitle>
          <CardDescription className="max-w-[400px] text-white">
            Immortalize your livestreams with NFTs. Create NFT
            collection from your livestream on Base Chain.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <CreateNFTCollectionModal type={type} />
        </CardFooter>
      </Card>

      <div className="flex flex-col p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Your Collections</p>
          <MintNftSort />
        </div>

        {nftCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {nftCollections.map((nft) => (
              <NFTCollectionCard
                organization={params.organization}
                key={nft._id}
                nft={nft as IExtendedNftCollections}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-96 bg-white m-auto flex-col justify-center items-center">
            <Image
              src="/images/empty-box.png"
              width={150}
              height={150}
              alt="empty nft"
            />
            <CardTitle className="font-semibold text-2xl mt-4">
              No NFT Collection
            </CardTitle>
            <CardDescription>
              Create your an NFT collection to get started!
            </CardDescription>
            <div className="w-fit mt-6">
              <CreateNFTCollectionModal type={type} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NFT
