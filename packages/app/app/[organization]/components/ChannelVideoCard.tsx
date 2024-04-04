import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { Button } from '@/components/ui/button'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { Download, EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ShareVideoMenuItem from './ShareVideoMenuItem'

const ChannelVideoCard = ({
  session,
  organizationSlug,
  tab,
}: {
  session: IExtendedSession
  organizationSlug?: string
  tab?: string
}) => {
  return (
    <div className="w-full min-h-full uppercase rounded-xl">
      <Link
        href={`/${organizationSlug}?tab=${tab}&playbackId=${session._id}`}>
        <Thumbnail
          imageUrl={session.coverImage}
          fallBack={session.coverImage}
        />
      </Link>
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <Link
            href={`/${organizationSlug}?tab=${tab}&playbackId=${session._id}`}>
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
            <EllipsisVertical className="mt-2 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ShareVideoMenuItem
                url={`/${organizationSlug}?tab=${tab}&playbackId=${session._id}`}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant="ghost">
                <Download className="w-5 h-5 pr-1" /> Download
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ChannelVideoCard
