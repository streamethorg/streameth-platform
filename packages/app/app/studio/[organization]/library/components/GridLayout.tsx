'use server'

import { IExtendedSession, eLayout } from '@/lib/types'
import StudioVideoCard from '@/components/misc/VideoCard/StudioVideoCard'
import Link from 'next/link'
import { Rows3, LayoutGrid } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { TableHeader, Table, TableHead } from '@/components/ui/table'
import EmptyLibrary from './EmptyLibrary'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import LayoutSelection from './LayoutSelection'

const GridLayout = async ({
  sessions,
  organizationId,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationId: string
  organizationSlug: string
}) => {
  if (!sessions || sessions.length === 0) {
    return (
      <EmptyLibrary
        organizationId={organizationId}
        organizationSlug={organizationSlug}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHead>
          <LayoutSelection
            currentLayout={eLayout.grid}
            organizationSlug={organizationSlug}
          />
        </TableHead>
      </TableHeader>
      <Separator />
      <div className="grid grid-cols-4 gap-4 m-5">
        <Suspense
          fallback={
            <div>
              <Skeleton className="rounded-full w-[100px] h-[20px]" />
            </div>
          }>
          {sessions.map((session) => (
            <div key={session._id}>
              <StudioVideoCard
                session={session}
                organizationSlug={organizationSlug}
              />
            </div>
          ))}
        </Suspense>
      </div>
    </Table>
  )
}

export default GridLayout
