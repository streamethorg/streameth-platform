'use client'

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Thumbnail from './thumbnail'
import Link from 'next/link'
import { IExtendedSession, eLayout } from '@/lib/types'
import PopoverActions from '@/app/studio/[organization]/library/components/PopoverActions'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'

const StudioVideoCard = ({
  session,
  organizationSlug,
  invertedColors,
}: {
  session: IExtendedSession
  organizationSlug: string
  invertedColors?: boolean
}) => {
  const headerClass = invertedColors ? ' ' : ''
  const descriptionClass = invertedColors ? '' : ''

  return (
    <div className="w-full min-h-full uppercase rounded-xl">
      <Link
        href={`/watch?event=${session.eventSlug}&session=${session._id}`}>
        {session.coverImage ? (
          <Thumbnail imageUrl={session.coverImage} />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <DefaultThumbnail />
          </div>
        )}
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
