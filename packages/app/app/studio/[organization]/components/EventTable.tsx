import Image from 'next/image'
import Link from 'next/link'

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { FilePenLine, Eye } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IExtendedEvent } from '@/lib/types'
const EventTable = async ({
  organization,
  events,
}: {
  organization: string
  events: IExtendedEvent[]
}) => {
  return (
    <Table>
      <TableCaption>A list of all your events.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Event</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event, index) => (
          <TableRow key={event._id}>
            <TableCell className="font-medium w-[450px]">
              <div className="flex flex-row w-full space-x-4">
                <Image
                  className="rounded-md"
                  alt="logo"
                  src={event.eventCover ?? ''}
                  width={100}
                  height={50}
                />
                <Link
                  href={`/studio/${organization}/event?eventId=${event.slug}&settings=event`}>
                  <div className="flex flex-col">
                    <p className=" hover:text-underline">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground max-h-8 overflow-clip">
                      {event.description}
                    </p>
                  </div>
                </Link>
              </div>
            </TableCell>
            <TableCell>
              {event.unlisted ? 'unlisted' : 'public'}
            </TableCell>
            <TableCell>
              {new Date(event.start).toDateString()} -
              {new Date(event.end).toDateString()}
            </TableCell>
            <TableCell className="flex flex-row space-x-4">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="h-full px-4"
                    href={`/studio/${organization}/event?eventId=${event.slug}&settings=event`}>
                    <FilePenLine />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Edit event</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="h-full px-4 "
                    href={`/${organization}/${event.slug}`}>
                    <Eye />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Go to event Page</TooltipContent>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default EventTable
