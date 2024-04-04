'use server'

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Thumbnail from './thumbnail'
import Link from 'next/link'
import { fetchEvent } from '@/lib/services/eventService'
import { IExtendedSession, eLayout } from '@/lib/types'
import PopoverActions from '@/app/studio/[organization]/library/components/PopoverActions'

const StudioVideoCard = async ({
  session,
  organizationSlug,
  invertedColors,
}: {
  session: IExtendedSession
  organizationSlug: string
  invertedColors?: boolean
}) => {
  const event = await fetchEvent({
    eventId: `${session.eventId}`,
  })

  const headerClass = invertedColors ? ' ' : ''
  const descriptionClass = invertedColors ? '' : ''

  return (
    <div className="w-full min-h-full uppercase rounded-xl">
      <Link
        href={`/watch?event=${session.eventSlug}&session=${session._id}`}>
        <Thumbnail
          imageUrl={session.coverImage}
          fallBack={event?.eventCover}
        />
      </Link>
      <CardHeader
        className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none ${headerClass}`}>
        <Link
          href={`/watch?event=${session.eventSlug}&session=${session._id}`}>
          <CardTitle
            className={`text-sm truncate hover:underline ${descriptionClass}`}>
            {session.name}
          </CardTitle>
        </Link>
        {event && (
          <div className="flex justify-between items-center">
            <CardDescription
              className={`text-xs truncate ${descriptionClass}`}>
              {new Date(session.createdAt!).toUTCString()}
            </CardDescription>
            <PopoverActions
              session={session}
              organizationSlug={organizationSlug}
              layout={eLayout.grid}
            />
          </div>
        )}
      </CardHeader>
    </div>
  )
}

export default StudioVideoCard
