'use server'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import TableCells from '../../components/library/TableCells'
import { Suspense } from 'react'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { IExtendedSession } from '@/lib/types'
import Link from 'next/link'

const ListLayout = async ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationSlug: string
}) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-3xl font-bold">
        No Assets available
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Table className="bg-white">
        <TableHeader className="sticky top-0 z-50 bg-white">
          <TableRow className="hover:bg-white">
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>IPFS Uri</TableHead>
            <TableHead>
              <div className="flex items-end space-x-2">
                <Link
                  href={`/studio/${organizationSlug}/library?layout=grid`}>
                  <LayoutGrid
                    size={30}
                    className="p-1 rounded-md border transition hover:text-white hover:bg-purple-500"
                  />
                </Link>
                <Link
                  href={`/studio/${organizationSlug}/library?layout=list`}>
                  <Rows3
                    size={30}
                    className="p-1 text-white bg-purple-500 rounded-md border transition"
                  />
                </Link>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          {sessions?.map((item, index) => (
            <TableRow key={item._id}>
              <TableCells
                item={item}
                index={index}
                organization={organizationSlug}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Suspense>
  )
}

export default ListLayout
