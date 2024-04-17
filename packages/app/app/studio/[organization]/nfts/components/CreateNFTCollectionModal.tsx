'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CreateNFTCollectionModal = ({ type }: { type: string }) => {
  const { handleTermChange } = useSearchParams()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Create NFT Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create NFT Collection</DialogHeader>

        <div className="flex items-center gap-5">
          <div
            onClick={() =>
              handleTermChange([{ key: 'type', value: 'single' }])
            }
            className={`relative flex flex-col p-3 border border-grey rounded-xl hover:bg-secondary cursor-pointer ${
              type == 'single' ? 'bg-secondary' : 'bg-none'
            }`}>
            {type == 'single' && (
              <div className="absolute end-0 px-2">
                <CheckCircle2 className="w-10 h-10 text-white fill-success" />
              </div>
            )}
            <div className="flex justify-center mb-3">
              <Image
                src="/images/singleNFT.png"
                alt="single"
                width={108}
                height={158}
                quality={100}
              />
            </div>
            <p className="font-medium">Single NFT</p>
            <p className="text-sm text-muted-foreground">
              Select single drop if you want to deploy one particular
              media into an NFT
            </p>
          </div>

          <div
            onClick={() =>
              handleTermChange([{ key: 'type', value: 'multiple' }])
            }
            className={`relative flex flex-col p-3 border border-grey rounded-xl hover:bg-secondary cursor-pointer ${
              type == 'multiple' ? 'bg-secondary' : 'bg-none'
            }`}>
            {type == 'multiple' && (
              <div className="absolute end-0 px-2">
                <CheckCircle2 className="w-10 h-10 text-white fill-success" />
              </div>
            )}
            <div className="flex justify-center mb-3">
              <Image
                src="/images/multipleNFT.png"
                alt="multiple"
                width={108}
                height={158}
                quality={100}
              />
            </div>
            <p className="font-medium">NFT Collection</p>
            <p className="text-sm text-muted-foreground">
              Select drop collection if you want to deploy multiple
              media into an NFT collection
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link href={`nfts/create?type=${type}`}>
            <Button
              disabled={!type}
              className="w-full"
              variant="primary">
              Create Collection
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNFTCollectionModal