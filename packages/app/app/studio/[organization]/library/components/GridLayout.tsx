'use server'

import { IExtendedSession, eLayout } from '@/lib/types'
import StudioVideoCard from '@/components/misc/VideoCard/StudioVideoCard'
import { Separator } from '@/components/ui/separator'
import {
  TableHeader,
  Table,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import EmptyLibrary from './EmptyLibrary'
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
          <LayoutSelection />
        </TableHead>
      </TableHeader>
      <Separator />
      <TableBody>
        <div className="grid grid-cols-4 gap-4 m-5">
          {sessions.map((session) => (
            <div key={session._id}>
              <StudioVideoCard
                session={session}
                organizationSlug={organizationSlug}
              />
            </div>
          ))}
        </div>
      </TableBody>
    </Table>
  )
}

export default GridLayout
