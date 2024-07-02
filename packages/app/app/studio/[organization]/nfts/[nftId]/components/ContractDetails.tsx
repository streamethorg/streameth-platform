'use client'
import React from 'react'
import { VideoNFTAbi, contractChainID } from '@/lib/contract'
import { useAccount, useChainId, useReadContracts } from 'wagmi'
import { type BaseError } from 'wagmi'
import TitleTextItem from '@/components/ui/TitleTextItem'
import CopyText from '@/components/misc/CopyText'

const ContractDetails = ({
  contractAddress,
}: {
  contractAddress?: string
}) => {
  const account = useAccount()
  const chain = useChainId()
  const videoNFTContract = {
    address: contractAddress as `0x${string}`,
    abi: VideoNFTAbi,
    chainId: contractChainID,
  } as const

  const result = useReadContracts({
    contracts: [
      {
        ...videoNFTContract,
        functionName: 'mintFee',
      },
      {
        ...videoNFTContract,
        functionName: 'totalSupply',
      },
      {
        ...videoNFTContract,
        functionName: 'baseTokenUri',
      },
    ],
  })

  const mintFee = result?.data?.[0].result
  const totalSupply = result?.data?.[1].result
  const baseTokenUri = result?.data?.[2].result as string

  return (
    <div className="space-y-1">
      <TitleTextItem
        title="Total Supply:"
        text={Number(totalSupply)}
      />
      <TitleTextItem title="Mint Fee:" text={Number(mintFee)} />

      <CopyText
        width="400px"
        label="baseTokenUri:"
        text={baseTokenUri}
      />
    </div>
  )
}

export default ContractDetails
