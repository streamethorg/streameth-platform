'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CreateNFTCollectionModal = ({ type }: { type: string }) => {
  const { handleTermChange } = useSearchParams();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlinePrimary" className="text-black">
          Create VideoNFT
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Select NFT Type</DialogHeader>

        <div className="flex items-center gap-5">
          <div
            onClick={() => handleTermChange([{ key: 'type', value: 'single' }])}
            className={`border-grey hover:bg-secondary relative flex cursor-pointer flex-col rounded-xl border p-3 ${
              type == 'single' ? 'bg-secondary' : 'bg-none'
            }`}
          >
            {type == 'single' && (
              <div className="absolute end-0 px-2">
                <CheckCircle2 className="fill-success h-10 w-10 text-white" />
              </div>
            )}
            <div className="mb-3 flex justify-center">
              <Image
                src="/images/singleNFT.png"
                alt="single"
                width={108}
                height={158}
                quality={100}
              />
            </div>
            <p className="font-medium">Single NFT</p>
            <p className="text-muted-foreground text-sm">
              Select single drop if you want to deploy one particular media into
              an NFT
            </p>
          </div>

          <div
            onClick={() =>
              handleTermChange([{ key: 'type', value: 'multiple' }])
            }
            className={`border-grey hover:bg-secondary relative flex cursor-pointer flex-col rounded-xl border p-3 ${
              type == 'multiple' ? 'bg-secondary' : 'bg-none'
            }`}
          >
            {type == 'multiple' && (
              <div className="absolute end-0 px-2">
                <CheckCircle2 className="fill-success h-10 w-10 text-white" />
              </div>
            )}
            <div className="mb-3 flex justify-center">
              <Image
                src="/images/multipleNFT.png"
                alt="multiple"
                width={108}
                height={158}
                quality={100}
              />
            </div>
            <p className="font-medium">NFT Collection</p>
            <p className="text-muted-foreground text-sm">
              Select drop collection if you want to deploy multiple media into
              an NFT collection
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link href={`nfts/create?type=${type}`}>
            <Button
              disabled={!type}
              className="w-full"
              variant="outlinePrimary"
            >
              Create NFT
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNFTCollectionModal;
