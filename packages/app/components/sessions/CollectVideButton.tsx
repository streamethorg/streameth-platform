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
import { VideoNFTAbi, contractChainID } from '@/lib/contract'
import { toast } from 'sonner'
import { calMintPrice, getVideoIndex } from '@/lib/utils/utils'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { type BaseError } from 'wagmi'
import TransactionHash from '@/app/studio/[organization]/nfts/create/components/TransactionHash'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'

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
  const account = useAccount()
  const chain = useChainId()
  const [isOpen, setIsOpen] = useState(false)
  const [mintError, setMintError] = useState('')

  const videoNFTContract = {
    address: nftCollection?.contractAddress as `0x${string}`,
    abi: VideoNFTAbi,
    chainId: contractChainID,
  } as const

  const { switchChainAsync, isPending: IsSwitchingChain } =
    useSwitchChain()

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
      {
        ...videoNFTContract,
        functionName: 'sessionMinted',
        args: [
          account?.address as `Ox${string}`,
          getVideoIndex(all, nftCollection!, video),
        ],
      },
    ],
  })

  const hasMintedSession = result.data?.[2].result

  const {
    data: hash,
    writeContract,
    error,
    isError,
    isPending: isMintingNftPending,
  } = useWriteContract()

  const { isSuccess } = useWaitForTransactionReceipt({
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
      toast.error('NFT of the video failed to mint. Please try again')
    }
  }, [isSuccess, isError, error])

  const handleWriteContract = () => {
    setMintError('')
    if (result?.data?.[0].status === 'success' && nftCollection) {
      writeContract({
        abi: VideoNFTAbi,
        address: nftCollection?.contractAddress as `0x${string}`,
        functionName: 'sessionMint',
        args: [getVideoIndex(all, nftCollection, video)],
        value: BigInt(
          calMintPrice(
            result?.data as { result: BigInt }[],
            true,
            nftCollection
          ) as string
        ),
      })
    } else {
      setMintError('An error occurred, try again later')
    }
  }

  const mintCollection = () => {
    setMintError('')
    setIsOpen(true)
    if (chain !== contractChainID) {
      switchChainAsync(
        { chainId: contractChainID },
        {
          onSuccess: () => {
            handleWriteContract()
          },
          onError: () => {
            setMintError('Error switching chain')
          },
        }
      )
    } else {
      handleWriteContract()
    }
  }

  return hasMintedSession ? (
    <Button disabled variant={'outline'}>
      Session Collected
    </Button>
  ) : (
    <div>
      {!account.address ? (
        <ConnectWalletButton />
      ) : (
        <Button
          loading={isMintingNftPending || IsSwitchingChain}
          onClick={mintCollection}
          variant={variant}
          className="w-full md:w-36">
          {all ? 'Collect All Videos' : 'Collect Video'}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>
            {isError || mintError
              ? 'Error'
              : hash
                ? 'Transaction Approved'
                : 'Approve transaction'}
          </DialogTitle>

          {mintError || error ? (
            <div className="text-destructive text-center">
              {mintError ||
                (error as BaseError).shortMessage ||
                error?.message}
            </div>
          ) : hash ? (
            <TransactionHash hash={hash} />
          ) : (
            <div className="flex gap-2 items-center">
              <div className="p-2 mr-2 rounded-full bg-grey h-fit">
                {isMintingNftPending || IsSwitchingChain ? (
                  <Loader2 className="w-6 h-6 rounded-full animate-spin text-success" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-white fill-success" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  Go to your wallet to approve the transaction
                </p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be asked to pay gas fees plus mint fee
                  to collect video on the blockchain.
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
