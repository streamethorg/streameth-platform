'use client'

import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { generateThumbnailAction } from '@/lib/actions/sessions'

const VideoCardWithMenu = ({
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
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const getThumbnail = async (session: IExtendedSession) => {
      try {
        const generatedThumbnail =
          await generateThumbnailAction(session)
        setThumbnail(generatedThumbnail)
      } catch (error) {
        console.error('Failed to generate thumbnail:', error)
      }
    }

    if (session) {
      getThumbnail(session)
    }
  }, [])

  return (
    <div className="flex flex-col w-full min-h-full uppercase rounded-xl">
      <Link className="w-full h-full" href={link}>
        <Thumbnail
          imageUrl={session.coverImage}
          fallBack={thumbnail}
        />
      </Link>
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <Link target="_blank" rel="noopener" href={link}>
            <CardTitle
              className={`text-sm capitalize line-clamp-2 overflow-hidden  hover:underline `}>
              {session.name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex justify-between items-center">
              <CardDescription className={`text-xs truncate `}>
                {formatDate(
                  new Date(session.updatedAt as string),
                  'ddd. MMM. D, YYYY'
                )}
              </CardDescription>
            </div>
          )}
        </CardHeader>

        {DropdownMenuItems && (
          <Popover>
            <PopoverTrigger className="z-10">
              <EllipsisVertical className="mt-2" />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              {DropdownMenuItems}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default VideoCardWithMenu
