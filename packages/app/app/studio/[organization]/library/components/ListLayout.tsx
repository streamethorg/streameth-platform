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
import { IExtendedSession, eSort } from '@/lib/types'
import LayoutSelection from './LayoutSelection'
import useSearchParams from '@/lib/hooks/useSearchParams'

const ListLayout = ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationSlug: string
}) => {
  const { searchParams, handleTermChange } = useSearchParams()
  const currentSort = searchParams.get('sort') as eSort

  return (
    <Table className="bg-white">
      <TableHeader className="sticky top-0 z-50 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead className="cursor-pointer">
            <div
              className="flex justify-start items-center space-x-2"
              onClick={() =>
                handleTermChange([
                  {
                    key: 'sort',
                    value:
                      currentSort === eSort.asc_alpha
                        ? eSort.desc_alpha
                        : eSort.asc_alpha,
                  },
                ])
              }>
              <p>Title</p>
              <ChevronsUpDown
                size={15}
                className="rounded-md hover:bg-gray-200"
              />
            </div>
          </TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead className="cursor-pointer">
            <div
              className="flex justify-start items-center space-x-2"
              onClick={() =>
                handleTermChange([
                  {
                    key: 'sort',
                    value:
                      currentSort === eSort.asc_date
                        ? eSort.desc_date
                        : eSort.asc_date,
                  },
                ])
              }>
              <p>Created at</p>
              <ChevronsUpDown
                size={15}
                className="rounded-md hover:bg-gray-200"
              />
            </div>
          </TableHead>
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
