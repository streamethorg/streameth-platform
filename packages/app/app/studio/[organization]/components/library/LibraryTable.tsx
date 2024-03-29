'use server'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import { fetchAllSessions } from '@/lib/data'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import TableCells from './TableCells'
import UploadVideoDialog from './UploadVideoDialog'

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
  ).sessions.filter((session) => session.videoUrl)

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col w-full h-full bg-white">
        <Card className="p-4 shadow-none lg:border-none bg-secondary">
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>
              Upload and manage pre recorded videos
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <UploadVideoDialog organization={organization} />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <Card className="p-4 shadow-none lg:border-none bg-secondary">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Upload and manage pre recorded videos
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <UploadVideoDialog organization={organization} />
        </CardFooter>
      </Card>
      {!sessions || sessions.length === 0 ? (
        <div className="flex justify-center items-center h-full text-3xl font-bold">
          No Assets available
        </div>
      ) : (
        <Table className="bg-white">
          <TableHeader className="sticky top-0 z-50 bg-white">
            <TableRow className="hover:bg-white">
              <TableHead>#</TableHead>
              <TableHead>Asset name</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>IPFS Url</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-scroll">
            {sessions?.map((item, index) => (
              <TableRow key={item._id}>
                <TableCells
                  item={item}
                  index={index}
                  organization={organization}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default LibraryTable
