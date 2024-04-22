'use client'
import React, { useEffect, useState } from 'react'
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
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { type BaseError } from 'wagmi'
import TransactionHash from '@/app/studio/[organization]/nfts/create/components/TransactionHash'

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
  const [isOpen, setIsOpen] = useState(false)
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
      setIsOpen(false)
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
    setIsOpen(true)
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>
            {hash ? 'Transaction approved' : 'Approve transaction'}
          </DialogTitle>

          {error ? (
            <div className="text-destructive text-center">
              Error:{' '}
              {(error as BaseError).shortMessage || error.message}
            </div>
          ) : hash ? (
            <TransactionHash hash={hash} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-grey p-2 mr-2 rounded-full h-fit">
                {!isMintingNftPending ? (
                  <CheckCircle2 className="text-white fill-success w-6 h-6" />
                ) : (
                  <Loader2 className="w-6 h-6 text-success  rounded-full animate-spin" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  Go to your wallet to approve the transaction
                </p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be asked to pay gas fees and sign in
                  order to deploy your contract on the blockchain.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CollectVideButton
