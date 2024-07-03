import { fetchNFTCollection } from '@/lib/services/nftCollectionService'
import { nftPageParams } from '@/lib/types'
import { LuArrowLeft } from 'react-icons/lu'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import ContractDetails from './components/ContractDetails'
import CopyText from '@/components/misc/CopyText'
import TitleTextItem from '@/components/ui/TitleTextItem'

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
          <LuArrowLeft />
          <p>Back to collections</p>
        </div>
      </Link>

      <div className="flex flex-col bg-white rounded-xl border overflow-auto p-4">
        <h3 className="text-lg font-bold mb-3">Collection Details</h3>

        <CopyText
          width="600px"
          label="Contract Address:"
          text={collection.contractAddress}
        />

        <TitleTextItem title="Type:" text={collection.type} />
        <TitleTextItem
          title="Total Items:"
          text={collection.videos?.length}
        />

        <ContractDetails
          contractAddress={collection.contractAddress}
        />
      </div>
    </div>
  )
}

export default page
