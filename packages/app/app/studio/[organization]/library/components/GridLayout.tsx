'use client'

import { IExtendedSession } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import EmptyLibrary from './EmptyLibrary'
import LayoutSelection from './LayoutSelection'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import { DropdownItems } from './misc/DropdownGrid'

const GridLayout = ({
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
    <>
      <div className="py-2 px-4 space-y-2">
        <LayoutSelection />
        <Separator />
      </div>
      <div className="grid grid-cols-4 gap-4 m-5">
        {sessions.map((session) => (
          <div key={session._id}>
            <VideoCardWithMenu
              session={session}
              link={`watch?session=${session._id}`}
              DropdownMenuItems={DropdownItems({
                organizationSlug: organizationSlug,
                session: session,
              })}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default GridLayout
