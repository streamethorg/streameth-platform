'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  FilePenLine,
  Share2,
  Copy,
  TrashIcon,
  CircleEllipsisIcon,
  EllipsisVerticalIcon,
  Layers,
  Flag,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IExtendedSession, eLayout } from '@/lib/types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { toast } from 'sonner'

const PopoverActions = ({
  session,
}: {
  session: IExtendedSession
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVerticalIcon
          className="text-black cursor-pointer"
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
                  className="space-x-2 w-full">
                  <Share2 />
                  <p className="">Share</p>
                </Button>
              </DialogTrigger>
              <ShareModalContent />
            </Dialog>
            <Button className="space-x-2 w-full" variant={'outline'}>
              <Layers />
              <p className="">View Collection</p>
            </Button>
            <Button
              className="space-x-2 w-full text-red-500"
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
