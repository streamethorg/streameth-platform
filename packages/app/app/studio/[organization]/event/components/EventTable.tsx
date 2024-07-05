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
import { Trash2 } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IExtendedEvent } from '@/lib/types'
import DeleteEvent from './DeleteEvent'

const EventTable = async ({
  organization,
  events,
}: {
  organization: string
  events: IExtendedEvent[]
}) => {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <Card className="bg-secondary p-4 shadow-none lg:border-none">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription className="max-w-[500px]">
            Create a customised landing page for your event, stream on
            multiple stages concurrently, and engage with your
            audience in real time!
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={`/studio/${organization}/event/create`}>
            <Button variant={'primary'}>Create Event</Button>
          </Link>
        </CardFooter>
      </Card>
      <Table className="bg-white">
        <TableHeader className="sticky top-0 z-50 bg-white">
          <TableRow className="hover:bg-white">
            <TableHead className="">Event name</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          {events?.map((event, index) => (
            <TableRow className="" key={event._id}>
              <TableCell className="font-medium">
                <div className="flex w-full flex-row space-x-4">
                  <div className="w-[100px]">
                    <Image
                      className="rounded-md"
                      alt="logo"
                      src={event.eventCover ?? ''}
                      width={100}
                      height={50}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p>{event.name}</p>
                    <p className="max-h-8 overflow-clip text-xs text-muted-foreground">
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
                    className="events-center flex flex-row justify-center space-x-2"
                    href={`/studio/${organization}/event/${event._id}`}>
                    <FilePenLine className="text-muted-foreground" />
                    <p className="">Edit</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <Link
                    className="events-center flex flex-row justify-center space-x-2"
                    href={`/${event.organizationId}/${event.slug}`}>
                    <Eye className="text-muted-foreground" />
                    <p className="">View</p>
                  </Link>
                </Button>
                <Button variant={'outline'}>
                  <DeleteEvent
                    event={event}
                    TriggerComponent={
                      <Trash2 className="h-5 w-5 text-destructive" />
                    }
                  />
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
