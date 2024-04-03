'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FilePenLine, Eye, Menu, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DeleteAsset from './DeleteAsset'
import { IExtendedSession } from '@/lib/types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'

const PopoverActions = ({
  session,
  organization,
}: {
  session: IExtendedSession
  organization: string
}) => {
  const itemId = session._id

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Menu className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Dialog>
              <DialogTrigger className="w-full">
                <Button
                  variant={'outline'}
                  className="w-full space-x-2">
                  <Share2 className="=text-muted-foreground" />
                  <p className="">Share</p>
                </Button>
              </DialogTrigger>
              <ShareModalContent />
            </Dialog>
            <Button variant={'outline'}>
              <Link
                className="flex flex-row justify-center items-center space-x-2"
                href={`/studio/${organization}/library/${itemId}`}>
                <FilePenLine className="text-muted-foreground" />
                <p className="">Edit</p>
              </Link>
            </Button>
            <Button variant={'outline'}>
              <Link
                className="flex flex-row justify-center items-center space-x-2"
                href={`/watch?session=${itemId}`}>
                <Eye className="text-muted-foreground" />
                <p>View</p>
              </Link>
            </Button>
            <DeleteAsset
              session={session}
              href={`/studio/${organization}?settings=videos`}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverActions
