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
import { FilePenLine, Eye, TrashIcon } from 'lucide-react'
import { IExtendedSession } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col h-full w-full bg-white">
      <Card className="shadow-none p-4 bg-secondary lg:border-none">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Upload and manage pre recorded videos
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant={'primary'} className="text-white">
            Upload video
          </Button>
        </CardFooter>
      </Card>
      <Table className="bg-white">
        <TableHeader className="sticky top-0 bg-white z-50">
          <TableRow className="hover:bg-white">
            <TableHead className="">Asset name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>IPFS Hash</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll ">
          {sessions?.map((item, index) => (
            <TableRow className="" key={item._id}>
              <TableCell className="font-medium">
                <div className="flex flex-row w-full space-x-4">
                  <div className="w-[100px]">
                    <LibraryThumbnail session={item} />
                  </div>
                  <div className="flex flex-col ">
                    <p>{item.name}</p>
                    <p className="text-xs text-muted-foreground max-h-8 overflow-clip">
                      {item.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              {item.createdAt && (
                <TableCell>
                  {new Date(item.createdAt).toUTCString()}
                </TableCell>
              )}
              <TableCell>{'item.ipfsHash'}</TableCell>
              <TableCell className="flex flex-row space-x-4">
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row items-center space-x-2 justify-center"
                    href={`/studio/${organization}/library/${item._id}`}>
                    <FilePenLine className="text-muted-foreground" />
                    <p className="">Edit</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row items-center space-x-2 justify-center"
                    href={`/watch?session=${item._id}`}>
                    <Eye className="text-muted-foreground" />
                    <p className="">View</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row items-center space-x-2 justify-center"
                    href={`/watch?session=${item._id}`}>
                    <TrashIcon className=" text-red-600" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
