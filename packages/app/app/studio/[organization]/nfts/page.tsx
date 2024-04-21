import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CreateNFTCollectionModal from './components/CreateNFTCollectionModal'
import { fetchOrganizationNFTCollections } from '@/lib/services/nftCollectionService'
import { fetchOrganization } from '@/lib/services/organizationService'
import NFTCollectionCard from './components/NFTCollectionCard'

const NFT = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { type: string }
}) => {
  const { type } = searchParams
  const organizationId = (
    await fetchOrganization({ organizationSlug: params.organization })
  )?._id
  if (!organizationId) return null
  const nftCollections = await fetchOrganizationNFTCollections({
    organizationId,
  })
  console.log(nftCollections)
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

      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Your Collections</p>
          <div className="flex gap-2 items-center font-medium">
            <p>Sort By</p>
            <Button variant="outline">
              Most Recent <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {nftCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {nftCollections.map((nft) => (
              <NFTCollectionCard
                organization={params.organization}
                key={nft._id}
                nft={nft}
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
const obj = {
  name: 'ETH Safari 2023',
  description: 'Some dec',
  thumbnail:
    'https://streameth-develop.ams3.digitaloceanspaces.com/nftcollections/2.a1f5695f030fa16c13aa.png',
  type: 'multiple',
  organizationId: '65a90bf17932ebe436ba9345',
  videos: [
    [
      {
        type: 'video',
        stageId: '',
        sessionId: '65b8f60ba5b2d09b88ec0c74',
      },
      {
        type: 'video',
        stageId: '',
        sessionId: '65b8f60ba5b2d09b88ec0c7a',
      },
      {
        type: 'video',
        stageId: '',
        sessionId: '65b8f60ba5b2d09b88ec0c80',
      },
    ],
  ],
}
