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

const NFT = ({
  searchParams,
}: {
  searchParams: { type: string }
}) => {
  const { type } = searchParams
  const nftCollections = []
  return (
    <div className="flex flex-col bg-white h-full">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/nftBg.jpg)`,
        }}
        className="shadow-none bg-cover text-white bg-no-repeat p-4 border-none">
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
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Your Collections</p>
          <div className="flex gap-2 items-center font-medium">
            <p>Sort By</p>
            <Button variant="outline">
              Most Recent <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {nftCollections.length > 0 ? null : (
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
