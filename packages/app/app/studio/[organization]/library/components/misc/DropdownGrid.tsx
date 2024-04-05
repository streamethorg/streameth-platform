'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ReactNode } from 'react'
import {
  Copy,
  Download,
  FilePenLine,
  Share2,
  TrashIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeleteAsset from '../DeleteAsset'
import { IExtendedSession } from '@/lib/types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { DialogContent } from '@radix-ui/react-dialog'
import Link from 'next/link'

const TriggerComponent = (): ReactNode => {
  return (
    <div className="flex justify-start">
      <Button variant={'ghost'} className="space-x-2">
        <TrashIcon className="text-red-500" />
        <p>Delete</p>
      </Button>
    </div>
  )
}

export const DropdownItems = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug: string
}): ReactNode => {
  const handleCopy = () => {
    navigator.clipboard.writeText(session.ipfsURI as string)
  }

  return (
    <div className="flex flex-col justify-start">
      <DropdownMenuItem>
        <Button variant={'ghost'} className="space-x-2">
          <Share2 className="=text-muted-foreground" />
          <p className="">Share</p>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Button variant={'ghost'} className="space-x-2">
          <Download />
          <p>Download</p>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Button variant={'ghost'}>
          <Link
            className="flex flex-row justify-center items-center space-x-2"
            href={`/studio/${organizationSlug}/library/${
              session._id as string
            }`}>
            <FilePenLine className="text-muted-foreground" />
            <p className="">Edit</p>
          </Link>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Button
          variant={'ghost'}
          className="space-x-2"
          onClick={() => handleCopy()}>
          <Copy />
          <p>Copy IPFS Hash</p>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <DeleteAsset
          session={session}
          href={`/studio/${organizationSlug}/library`}
          TriggerComponent={TriggerComponent()}
        />
      </DropdownMenuItem>
    </div>
  )
}
