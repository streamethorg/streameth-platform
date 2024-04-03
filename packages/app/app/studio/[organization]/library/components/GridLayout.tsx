'use server'

import { IExtendedSession } from '@/lib/types'
import StudioVideoCard from '@/components/misc/VideoCard/StudioVideoCard'
import Link from 'next/link'
import { Rows3, LayoutGrid } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { TableHeader, Table, TableHead } from '@/components/ui/table'

const GridLayout = async ({
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
    <Table>
      <TableHeader>
        <TableHead>
          <div className="flex justify-end space-x-2">
            <Link
              href={`/studio/${organizationSlug}/library?layout=grid`}>
              <LayoutGrid
                size={30}
                className="p-1 text-white bg-purple-500 rounded-md border transition"
              />
            </Link>
            <Link
              href={`/studio/${organizationSlug}/library?layout=list`}>
              <Rows3
                size={30}
                className="p-1 rounded-md border transition hover:text-white hover:bg-purple-500"
              />
            </Link>
          </div>
        </TableHead>
      </TableHeader>
      <Separator />
      <div className="grid grid-cols-4 gap-4 m-5">
        {sessions.map((session) => (
          <div key={session._id}>
            <StudioVideoCard session={session} />
          </div>
        ))}
      </div>
    </Table>
  )
}

export default GridLayout
