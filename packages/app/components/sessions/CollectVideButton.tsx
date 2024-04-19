'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import {
  IExtendedNftCollections,
  IExtendedSession,
} from '@/lib/types'
import {
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { VideoNFTAbi } from '@/lib/contract'
import { toast } from 'sonner'

const CollectVideButton = ({
  video,
  nftCollection,
  variant = 'primary',
}: {
  video: IExtendedSession
  nftCollection: IExtendedNftCollections | null
  variant?: 'primary' | 'outline'
}) => {
  const videoNFTContract = {
    address: nftCollection?.contractAddress as `0x${string}`,
    abi: VideoNFTAbi,
  } as const

  const result = useReadContracts({
    contracts: [
      {
        ...videoNFTContract,
        functionName: 'mintFee',
      },
      {
        ...videoNFTContract,
        functionName: 'baseFee',
      },
    ],
  })

  const calMintPrice = () => {
    if (result.data) {
      return (
        Number(result?.data[0].result) +
        Number(result?.data[1].result).toString()
      )
    }
    return null
  }

  const {
    data: hash,
    writeContract,
    error,
    isError,
    isPending: isMintingNftPending,
  } = useWriteContract()

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        'NFT of the video successfully minted to your wallet'
      )
    }
    if (isError) {
      toast.error('NFT of the video failed to mint. Please try again')
    }
  }, [isSuccess, isError])

  const videoIndex = nftCollection?.videos?.find(
    (vid) => vid.sessionId == video._id
  )?.index

  const mintCollection = () => {
    writeContract({
      abi: VideoNFTAbi,
      address: nftCollection?.contractAddress as `0x${string}`,
      functionName: 'sessionMint',
      args: [[videoIndex]],
      value: BigInt(calMintPrice() as string),
    })
  }

  return (
    <div>
      <Button
        loading={isMintingNftPending || isLoading}
        onClick={mintCollection}
        variant={variant}
        className="w-full md:w-36">
        Collect Video
      </Button>
    </div>
  )
}

export default CollectVideButton
