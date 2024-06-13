import { fetchNFTCollection } from '@/lib/services/nftCollectionService'
import { nftPageParams } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import ContractDetails from './components/ContractDetails'
import CopyText from '@/components/misc/CopyText'

const page = async ({ params }: nftPageParams) => {
  if (!params.nftId) return notFound()

  const collection = await fetchNFTCollection({
    collectionId: params.nftId,
  })
  if (!collection) return notFound()

  return (
    <div className="p-2 mx-6 h-full">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center my-4  space-x-4">
          <ArrowLeft />
          <p>Back to NFT collection</p>
        </div>
      </Link>

      <h3 className="text-5xl font-bold mb-3">Collection Details</h3>

      {/* <div className="w-full">
        <CopyText
          label="Contract Address:"
          text={collection.contractAddress}
        />
      </div> */}
      <p>Contract Address: {collection.contractAddress}</p>
      <p>Collection Type: {collection.type}</p>
      <p>Collection Items count: {collection.videos?.length}</p>

      <ContractDetails />
    </div>
  )
}

export default page
