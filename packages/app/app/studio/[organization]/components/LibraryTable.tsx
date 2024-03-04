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
import { IExtendedSession } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
const LibraryTable = async ({
  organization,
}: {
  organization: string
}) => {
  const sessions = (
    await fetchAllSessions({
      organizationSlug: organization,
      onlyVideos: true,
    })
  ).sessions

  return (
    <Table className=" h-full w-full">
      <TableCaption>A list of all your videos.</TableCaption>
      <TableHeader className="sticky top-0 bg-white z-50">
        <TableRow>
          <TableHead className="">Asset name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-scroll h-full">
        {sessions?.map((item, index) => (
          <TableRow key={item._id}>
            <TableCell className="font-medium w-[450px]">
              <div className="flex flex-row w-full space-x-4">
                <div className="w-[100px]">
                  <LibraryThumbnail session={item} />
                </div>
                <div className="flex flex-col w-[350px]">
                  <p>{item.name}</p>
                  <p className="text-xs text-muted-foreground max-h-8 overflow-clip">
                    {item.description}
                  </p>
                </div>
              </div>
            </TableCell>
            {item.createdAt && <TableCell>{new Date(item.createdAt).toUTCString()}</TableCell> }
            <TableCell className="flex flex-row space-x-4">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="h-full px-4"
                    href={`/studio/${organization}/library/${item._id}`}>
                    <FilePenLine />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Edit event</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="h-full px-4"
                    href={`/watch?session=${item._id}`}>
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

const LibraryThumbnail = async ({
  session,
}: {
  session: IExtendedSession
}) => {
  const sessionEvent = await fetchEvent({
    eventId: session.eventId as string,
  })

  return (
    <Thumbnail
      imageUrl={session.coverImage}
      fallBack={sessionEvent?.eventCover}
    />
  )
}

export default LibraryTable
