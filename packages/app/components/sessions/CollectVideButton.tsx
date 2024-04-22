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
import { calMintPrice, getVideoIndex } from '@/lib/utils/utils'

const CollectVideButton = ({
  video,
  nftCollection,
  variant = 'primary',
  all = false,
}: {
  video?: IExtendedSession
  nftCollection: IExtendedNftCollections | null
  variant?: 'primary' | 'outline'
  all?: boolean
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
      console.log(error)
      toast.error('NFT of the video failed to mint. Please try again')
    }
  }, [isSuccess, isError, error])

  const mintCollection = () => {
    writeContract({
      abi: VideoNFTAbi,
      address: nftCollection?.contractAddress as `0x${string}`,
      functionName: 'sessionMint',
      args: [getVideoIndex(all, nftCollection!, video)],
      value: BigInt(
        calMintPrice(
          result?.data as { result: BigInt }[],
          all,
          nftCollection!
        ) as string
      ),
    })
  }

  return (
    <div>
      <Button
        loading={isMintingNftPending || isLoading}
        onClick={mintCollection}
        variant={variant}
        className="w-full md:w-36">
        {all ? 'Collect All Videos' : 'Collect Video'}
      </Button>
    </div>
  )
}

export default CollectVideButton
