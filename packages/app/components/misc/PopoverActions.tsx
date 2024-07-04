'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Share2,
  EllipsisVerticalIcon,
  Layers,
  Flag,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IExtendedSession } from '@/lib/types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'

const PopoverActions = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug?: string
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVerticalIcon
          className="cursor-pointer text-black"
          size={30}
        />
      </PopoverTrigger>
      <PopoverContent className="mr-auto w-60">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Dialog>
              <DialogTrigger>
                <Button
                  variant={'outline'}
                  className="w-full space-x-2">
                  <Share2 />
                  <p className="">Share</p>
                </Button>
              </DialogTrigger>
              <ShareModalContent />
            </Dialog>
            {session?.nftCollections?.[0] && (
              <Button
                className="w-full space-x-2"
                variant={'outline'}>
                <Layers />
                <Link
                  href={`/${organizationSlug}/collection?collectionId=${session?.nftCollections[0]}`}
                  className="">
                  View Collection
                </Link>
              </Button>
            )}
            <Button className="w-full space-x-2" variant={'outline'}>
              <Layers />
              <p className="">View Collection</p>
            </Button>
            <Button
              className="w-full space-x-2 text-red-500"
              variant={'outline'}>
              <Flag />
              <p className="">Report</p>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverActions
