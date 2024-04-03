import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IExtendedStage } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { MoreVertical, Share2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import DeleteLivestream from './DeleteLivestream'
import ShareButton, {
  ShareModalContent,
} from '@/components/misc/interact/ShareButton'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import ShareLivestream from './ShareLivestream'

const LivestreamTable = ({
  streams,
  organizationSlug,
}: {
  streams: IExtendedStage[]
  organizationSlug: string
}) => {
  return (
    <div className="">
      <Table className="bg-white">
        <TableHeader className="sticky top-0 bg-white z-50">
          <TableRow className="hover:bg-white">
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto ">
          {streams?.map((stream) => (
            <TableRow key={stream._id}>
              <TableCell className="font-medium">
                <Link
                  key={stream._id}
                  href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}>
                  <div className="flex flex-row items-center w-full space-x-4">
                    <p className="underline">{stream?.name}</p>
                  </div>
                </Link>
              </TableCell>

              <TableCell>
                {formatDate(
                  new Date(stream?.createdAt as string),
                  'ddd. MMMM. D, YYYY'
                )}
              </TableCell>

              <TableCell>
                <div className="flex gap-4 items-center">
                  <ShareLivestream
                    organization={organizationSlug}
                    streamId={stream._id}
                  />
                  <DeleteLivestream stream={stream} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LivestreamTable
