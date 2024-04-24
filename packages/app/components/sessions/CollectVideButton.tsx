'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  IExtendedNftCollections,
  IExtendedSession,
} from '@/lib/types'
import {
  useAccount,
  useChainId,
  useReadContracts,
  useSwitchChain,
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
  const [mintError, setMintError] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  const videoNFTContract = {
    address: nftCollection?.contractAddress as `0x${string}`,
    abi: VideoNFTAbi,
  } as const
  const { switchChain } = useSwitchChain()
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
  const account = useAccount()
  const chain = useChainId()

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false)
      setIsMinting(false)
      toast.success(
        'NFT of the video successfully minted to your wallet'
      )
    }
    if (isError) {
      setIsMinting(false)
      toast.error('NFT of the video failed to mint. Please try again')
    }
  }, [isSuccess, isError, error])

  const mintCollection = () => {
    setMintError('')
    setIsMinting(true)
    setIsOpen(true)
    if (!account.address || chain !== 84532) {
      switchChain({ chainId: 84532 })
      setMintError('Please switch to base sepolia before continuing.')
      setIsMinting(false)
    } else {
      writeContract({
        abi: VideoNFTAbi,
        address: nftCollection?.contractAddress as `0x${string}`,
        functionName: 'sessionMint',
        args: [getVideoIndex(all, nftCollection!, video)],
        value: BigInt(
          calMintPrice(
            result?.data as { result: BigInt }[],
            true,
            nftCollection!
          ) as string
        ),
      })
    }
  }

  return (
    <div>
      <Button
        loading={isMinting}
        onClick={mintCollection}
        variant={variant}
        className="w-full md:w-36">
        {all ? 'Collect All Videos' : 'Collect Video'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>
            {isError || mintError
              ? 'Error'
              : hash
                ? 'Transaction Approved'
                : 'Approve transaction'}
          </DialogTitle>

          {hash && <TransactionHash hash={hash} />}
          {mintError || error ? (
            <div className="text-destructive text-center">
              {mintError ||
                (error as BaseError).shortMessage ||
                error?.message}
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <div className="p-2 mr-2 rounded-full bg-grey h-fit">
                {!isMintingNftPending ? (
                  <CheckCircle2 className="w-6 h-6 text-white fill-success" />
                ) : (
                  <Loader2 className="w-6 h-6 rounded-full animate-spin text-success" />
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
