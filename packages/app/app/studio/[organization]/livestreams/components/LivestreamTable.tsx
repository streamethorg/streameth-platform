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
import { CardDescription, CardTitle } from '@/components/ui/card'
import EmptyFolder from '@/lib/svg/EmptyFolder'

const LivestreamTable = ({
  streams,
  organizationSlug,
}: {
  streams: IExtendedStage[]
  organizationSlug: string
}) => {
  if (streams.length === 0) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-xl border bg-white">
        <EmptyFolder />
        <CardTitle className="text-2xl font-semibold">
          No livestreams found
        </CardTitle>
        <CardDescription>
          Create your first livestream to get started!
        </CardDescription>
      </div>
    )
  }
  return (
    <div className="mb-10 h-[95%] w-full rounded-xl border bg-white p-1">
      <Table className="rounded-xl bg-white p-1">
        <TableHeader className="sticky top-0 z-50 border-b bg-white">
          <TableRow className="rounded-t-xl hover:bg-white">
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
              <TableCell className="max-w-[500px] font-medium">
                <div className="flex w-full flex-row items-center space-x-4">
                  <div className="relative w-[100px] min-w-[100px] overflow-hidden">
                    {stream.thumbnail ? (
                      <Thumbnail imageUrl={stream.thumbnail} />
                    ) : (
                      <DefaultThumbnail />
                    )}
                    {stream.streamSettings?.isActive && (
                      <p className="absolute right-0 top-0 bg-destructive p-1 text-sm text-white">
                        live
                      </p>
                    )}
                  </div>

                  <Link
                    key={stream._id}
                    href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}>
                    <p className="line-clamp-3 hover:underline">
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
              <TableCell className="my-2 flex items-center space-x-2">
                <Link
                  key={stream._id}
                  href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}>
                  <Button variant="outlinePrimary">Manage</Button>
                </Link>
                <Link
                  href={`/studio/${organizationSlug}/clips?stage=${stream._id}`}>
                  <Button
                    variant="primary"
                    className="flex w-full items-center gap-1">
                    <ScissorsLineDashed className="h-4 w-4" />
                    Clip
                  </Button>
                </Link>
                <Popover>
                  <PopoverTrigger className="z-10 flex items-center">
                    <EllipsisVertical />
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
