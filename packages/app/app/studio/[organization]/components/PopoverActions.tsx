'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FilePenLine, Eye, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DeleteAsset from './DeleteAsset'
import { IExtendedSession } from '@/lib/types'

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
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Actions</h4>
            <p className="text-sm text-muted-foreground">
              Choose an action for your selected asset
            </p>
          </div>
          <div className="grid gap-2">
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
              session={itemId}
              href={`/studio/${organization}?settings=videos`}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverActions
