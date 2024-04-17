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
import Link from 'next/link'
import { toast } from 'sonner'

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
    toast.success('Copied IPFS Hash to your clipboard')
  }

  return (
    <div className="flex flex-col justify-start">
      <DropdownMenuItem>
        <Link
          href={`/studio/${organizationSlug}/library/${
            session._id as string
          }`}>
          <Button
            variant={'ghost'}
            className="flex flex-row justify-center items-center space-x-2">
            <FilePenLine className="text-muted-foreground" />
            <p className="">Edit</p>
          </Button>
        </Link>
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
    </div>
  )
}
