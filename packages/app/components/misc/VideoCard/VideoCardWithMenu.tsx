import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { generateThumbnail } from '@/lib/actions/livepeer'

const VideoCardWithMenu = async ({
  session,
  showDate = true,
  DropdownMenuItems,
  link,
}: {
  session: IExtendedSession
  showDate?: boolean
  DropdownMenuItems?: ReactNode
  link: string
}) => {
  const thumbnail = await generateThumbnail(session)

  return (
    <div className="w-full min-h-full uppercase rounded-xl flex flex-col">
      <Link className="w-full h-full" href={link}>
        <Thumbnail
          imageUrl={session.coverImage}
          fallBack={thumbnail}
        />
      </Link>
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <Link href={link}>
            <CardTitle
              className={`text-sm capitalize line-clamp-2 overflow-hidden  hover:underline `}>
              {session.name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex justify-between items-center">
              <CardDescription className={`text-xs truncate `}>
                {formatDate(
                  new Date(session.createdAt as string),
                  'ddd. MMM. D, YYYY'
                )}
              </CardDescription>
            </div>
          )}
        </CardHeader>

        {DropdownMenuItems && (
          <DropdownMenu>
            <DropdownMenuTrigger className="z-10">
              <EllipsisVertical className="mt-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {DropdownMenuItems}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default VideoCardWithMenu
