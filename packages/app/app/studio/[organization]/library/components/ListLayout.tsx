'use server'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import TableCells from './TableCells'
import { ChevronsUpDown } from 'lucide-react'
import { IExtendedSession, eLayout, eSort } from '@/lib/types'
import EmptyLibrary from './EmptyLibrary'
import LayoutSelection from './LayoutSelection'
// import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ListLayout = async ({
  sessions,
  organizationId,
  organizationSlug,
  layout,
  sort,
}: {
  sessions: IExtendedSession[]
  organizationId: string
  organizationSlug: string
  layout: eLayout
  sort: eSort
}) => {
  const href = `/studio/test_xanny/library?layout=${layout}&sort=${
    sort === eSort.asc ? eSort.desc : eSort.asc
  }`

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyLibrary
        organizationId={organizationId}
        organizationSlug={organizationSlug}
      />
    )
  }

  return (
    <Table className="bg-white">
      <TableHeader className="sticky top-0 z-50 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead className="cursor-pointer">
            <Link href={href}>
              <div className="flex justify-start items-center space-x-2">
                <p>Title</p>
                <ChevronsUpDown size={15} />
              </div>
            </Link>
          </TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>IPFS Hash</TableHead>
          <TableHead>
            <LayoutSelection />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-scroll">
        {sessions.map((item) => (
          <TableRow key={item._id}>
            <TableCells item={item} organization={organizationSlug} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ListLayout
