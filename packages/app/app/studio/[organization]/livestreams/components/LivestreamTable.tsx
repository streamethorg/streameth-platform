import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IExtendedOrganization, IExtendedStage } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import Link from 'next/link'
import React from 'react'
import ToggleLivestreamVisibility from './ToggleLivestreamVisibility'
import TableSort from '@/components/misc/TableSort'
import { EllipsisVertical } from 'lucide-react'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import LivestreamActions from './LivestreamActions'
import { Button } from '@/components/ui/button'
import { ScissorsLineDashed } from 'lucide-react'

const LivestreamTable = ({
  streams,
  organizationSlug,
  organization,
}: {
  organization: IExtendedOrganization
  streams: IExtendedStage[]
  organizationSlug: string
}) => {
  return (
    <div className="rounded-xl shadow-sm">
      <Table className="bg-white rounded-t-xl ">
        <TableHeader className="sticky top-0 z-50 bg-gray-100 border-separate">
          <TableRow className="hover:bg-whiterounded-t-xl border-b">
            <TableHead>
              <TableSort title="Title" sortBy="name" />
            </TableHead>
            <TableHead>
              <TableSort title="Date" sortBy="date" />
            </TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto">
          {streams?.map((stream) => (
            <TableRow key={stream._id}>
              <TableCell className="font-medium max-w-[500px]">
                <div className=" flex flex-row items-center space-x-4 w-full">
                  <div className="relative overflow-hidden min-w-[100px] w-[100px]">
                    {stream.thumbnail ? (
                      <Thumbnail imageUrl={stream.thumbnail} />
                    ) : (
                      <DefaultThumbnail />
                    )}
                    {stream.streamSettings?.isActive && (
                      <p className="absolute top-0 right-0 text-white bg-destructive p-1 text-sm">
                        live
                      </p>
                    )}
                  </div>

                  <Link
                    key={stream._id}
                    href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}>
                    <p className="hover:underline line-clamp-3">
                      {stream?.name}
                    </p>
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                {stream?.streamDate ? (
                  <p className="text-sm">
                    {formatDate(
                      new Date(stream?.streamDate),
                      'ddd. MMMM D, YYYY, HH:mm a'
                    )}{' '}
                    {stream.isMultipleDate &&
                      stream.streamEndDate &&
                      ' - ' +
                        formatDate(
                          new Date(stream?.streamEndDate),
                          'ddd. MMMM D, YYYY, HH:mm a'
                        )}
                    {new Date(stream.streamDate) > new Date() && (
                      <span className="block text-sm text-muted-foreground">
                        Scheduled
                      </span>
                    )}
                  </p>
                ) : (
                  formatDate(
                    new Date(stream?.createdAt as string),
                    'ddd. MMMM. D, YYYY'
                  )
                )}
              </TableCell>
              <TableCell>
                <ToggleLivestreamVisibility item={stream} />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Link
                  key={stream._id}
                  href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}>
                  <Button
                    variant="outline"
                    className="border-[#4219FF] hover:bg-[#4219FF] hover:text-white">
                    Go live
                  </Button>
                </Link>
                <Link
                  href={`/studio/${organizationSlug}/clips?stage=${stream._id}`}>
                  <Button
                    variant="outline"
                    className="flex gap-1 items-center w-full">
                    <ScissorsLineDashed className="w-4 h-4" />
                    Clip
                  </Button>
                </Link>

                <Popover>
                  <PopoverTrigger className="z-10">
                    <EllipsisVertical className="mt-2" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <LivestreamActions
                      stream={stream}
                      organizationSlug={organizationSlug}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LivestreamTable
