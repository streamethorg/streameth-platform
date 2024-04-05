import Image from 'next/image'
import Link from 'next/link'
import { FilePenLine, Eye, TrashIcon } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IExtendedEvent } from '@/lib/types'
const EventTable = async ({
  organization,
  events,
}: {
  organization: string
  events: IExtendedEvent[]
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-white">
      <Card className="shadow-none p-4 bg-secondary lg:border-none">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription className="max-w-[500px]">
            Create a customised landing page for your event, stream on
            multiple stages concurrently, and engage with your
            audience in real time!
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant={'primary'} className="text-white">
            Create Event
          </Button>
        </CardFooter>
      </Card>
      <Table className="bg-white">
        <TableHeader className="sticky top-0 bg-white z-50">
          <TableRow className="hover:bg-white">
            <TableHead className="">Event name</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll ">
          {events?.map((event, index) => (
            <TableRow className="" key={event._id}>
              <TableCell className="font-medium">
                <div className="flex flex-row w-full space-x-4">
                  <div className="w-[100px]">
                    <Image
                      className="rounded-md"
                      alt="logo"
                      src={event.eventCover ?? ''}
                      width={100}
                      height={50}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <p>{event.name}</p>
                    <p className="text-xs text-muted-foreground max-h-8 overflow-clip">
                      {event.description}
                    </p>
                  </div>
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
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row events-center space-x-2 justify-center"
                    href={`/studio/${organization}/event/${event._id}`}>
                    <FilePenLine className="text-muted-foreground" />
                    <p className="">Edit</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row events-center space-x-2 justify-center"
                    href={`/watch?session=${event._id}`}>
                    <Eye className="text-muted-foreground" />
                    <p className="">View</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <Link
                    className="flex flex-row events-center space-x-2 justify-center"
                    href={`/watch?session=${event._id}`}>
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

export default EventTable
