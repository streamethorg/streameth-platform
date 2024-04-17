'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PublishingNFTModal = ({
  open,
  onClose,
  isPublished,
  organization,
}: {
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  isPublished: boolean
  organization: string
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {!isPublished ? (
          <>
            {' '}
            <DialogTitle className="text-lg font-semibold">
              Publishing your NFT
            </DialogTitle>
            <div className="flex items-center gap-1">
              <div className="bg-grey p-2 mr-2 rounded-full h-fit">
                <Loader2 className="w-4 h-4 text-success  rounded-full animate-spin" />
              </div>
              <div>
                <p className="font-medium">
                  Publishing your NFT Collection
                </p>
                <p className="text-sm text-muted-foreground">
                  It may take some time for the transaction to be
                  processed.
                </p>
              </div>
            </div>
          </>
        ) : (
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
      </DialogContent>
    </Dialog>
  )
}

export default PublishingNFTModal
