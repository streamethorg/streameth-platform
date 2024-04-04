'use client'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import TableCells from './TableCells'
import { ChevronsUpDown } from 'lucide-react'
import { IExtendedSession, eLayout } from '@/lib/types'
import EmptyLibrary from './EmptyLibrary'
import LayoutSelection from './LayoutSelection'

const ListLayout = ({
  sessions,
  organizationId,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationId: string
  organizationSlug: string
}) => {
  const handleFilter = () => {
    console.log('click')
  }

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
          <TableHead>#</TableHead>
          <TableHead>
            <div
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={() => handleFilter()}>
              <p>Title</p>
              <ChevronsUpDown size={15} />
            </div>
          </TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>
            <div
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={() => handleFilter()}>
              <p>Created at</p>
              <ChevronsUpDown size={15} />
            </div>
          </TableHead>
          <TableHead>IPFS Hash</TableHead>
          <TableHead>
            <LayoutSelection
              currentLayout={eLayout.list}
              organizationSlug={organizationSlug}
            />
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
  )
}

export default ListLayout
