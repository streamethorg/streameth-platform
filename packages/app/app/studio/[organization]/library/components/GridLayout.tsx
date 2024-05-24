'use client'

import { IExtendedSession, eLayout } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import LayoutSelection from './LayoutSelection'
import VideoCardWithMenu from './misc/VideoCardWithMenu'
import { PopoverActions } from './misc/PopoverActions'
import VideoCardProcessing from '@/components/misc/VideoCard/VideoCardProcessing'

const GridLayout = ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationSlug: string
}) => {
  return (
    <>
      <div className="py-2 px-4 space-y-2">
        <LayoutSelection />
        <Separator />
      </div>
      <div className="grid grid-cols-4 gap-4 m-5">
        {sessions.map((session) => (
          <div key={session._id}>
            {session.videoUrl ? (
              <VideoCardWithMenu
                session={session}
                link={`/${organizationSlug}/watch?session=${session._id}`}
                DropdownMenuItems={PopoverActions({
                  organizationSlug: organizationSlug,
                  session: session,
                  layout: eLayout.grid,
                })}
              />
            ) : (
              <VideoCardProcessing session={session} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default GridLayout
