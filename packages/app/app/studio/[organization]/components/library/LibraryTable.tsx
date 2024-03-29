'use server'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import { Livepeer } from 'livepeer'
import { fetchAllSessions } from '@/lib/data'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import TableCells from './TableCells'
import { Suspense } from 'react'
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
  ).sessions

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const assetPromises = sessions.map(async (session) => {
    if (!session.assetId) {
      return Promise.reject(new Error('assetId is missing'))
    }
    return livepeer.asset
      .get(session.assetId as string)
      .then((response) => response.asset)
      .catch((error) => {
        console.error(
          `Failed to fetch asset for assetId ${session.assetId}:`,
          error
        )
      })
  })

  const assets = await Promise.all(assetPromises)

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
        <div className="flex justify-center items-center h-full text-3xl font-bold">
          No Assets available
        </div>
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
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            Loading...
          </div>
        }>
        <Table className="bg-white">
          <TableHeader className="sticky top-0 z-50 bg-white">
            <TableRow className="hover:bg-white">
              <TableHead>Index</TableHead>
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
                  hash={
                    assets[index]?.storage?.ipfs?.nftMetadata?.cid
                  }
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Suspense>
    </div>
  )
}

export default LibraryTable
