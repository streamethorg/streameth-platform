'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, ExternalLinkIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type BaseError } from 'wagmi'

const PublishingNFTModal = ({
  open,
  onClose,
  isPublished,
  organization,
  hash,
  isCreatingNftPending,
  error,
  isSuccess,
}: {
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  isPublished: boolean
  isSuccess: boolean
  organization: string
  hash?: string
  isCreatingNftPending: boolean
  error: BaseError | null
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {!isPublished && !error && (
          <>
            {' '}
            <DialogTitle className="text-lg font-semibold">
              Publishing your NFT
            </DialogTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-grey p-2 mr-2 rounded-full h-fit">
                  {isCreatingNftPending ? (
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
              <div className="flex items-center gap-2">
                <div className="bg-grey p-2 mr-2 rounded-full h-fit">
                  <Loader2 className="w-6 h-6 text-success  rounded-full animate-spin" />
                </div>

                <div>
                  <p className="font-medium">
                    Publishing your NFT Collection
                  </p>
                  <p className="text-sm text-muted-foreground">
                    It may take some time for the transaction to be
                    processed.
                  </p>
                  {hash && (
                    <Link
                      target="_blank"
                      rel="noopener"
                      className="text-blue text-sm flex items-center gap-1"
                      href={`https://sepolia.basescan.org/tx/${hash}`}>
                      View on Base Ethereum Scan{' '}
                      <ExternalLinkIcon className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {isSuccess && (
          <div className="flex flex-col justify-center items-center text-center p-4">
            <Image
              src="/images/NFTSuccess.png"
              width="100"
              height="100"
              alt="success"
            />
            <p className="text-2xl mt-4">
              NFT Collection successfully published
            </p>
            <p className="text-muted-foreground mt-1">
              Your collection now published. Share link to invite your
              community.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {/* // TODO correct nft link */}
              <ShareButton
                url={`streameth`}
                shareFor="nft collection"
              />
              <Link href={`/studio/${organization}/nfts`}>
                <Button
                  onClick={() => onClose(false)}
                  variant={'primary'}>
                  Done
                </Button>
              </Link>
            </div>
          </div>
        )}
        {error && (
          <div className="text-destructive text-center">
            Error:{' '}
            {(error as BaseError).shortMessage || error.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PublishingNFTModal
