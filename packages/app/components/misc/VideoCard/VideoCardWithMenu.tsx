'use client'

import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const VideoCardWithMenu = ({
  session,
  DropdownMenuItems,
  link,
}: {
  session: IExtendedSession
  DropdownMenuItems?: ReactNode
  link: string
}) => {
  return (
    <div className="w-full min-h-full uppercase rounded-xl">
      <Link href={link}>
        {session.coverImage ? (
          <Thumbnail imageUrl={session.coverImage} />
        ) : (
          <AspectRatio
            ratio={16 / 9}
            className="flex justify-center items-center w-full h-full">
            <DefaultThumbnail />
          </AspectRatio>
        )}
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

          <div className="flex justify-between items-center">
            <CardDescription className={`text-xs truncate `}>
              {formatDate(
                new Date(session.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="mt-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {DropdownMenuItems}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default VideoCardWithMenu
