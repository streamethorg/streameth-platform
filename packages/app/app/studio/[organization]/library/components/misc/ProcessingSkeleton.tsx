'use client'

import { TableCell } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { formatDate } from '@/lib/utils/time'
import { IExtendedSession } from '@/lib/types'

const ProcessingSkeleton = ({ item }: { item: IExtendedSession }) => {
  return (
    <>
      <TableCell className="relative cursor-not-allowed bg-muted font-medium opacity-50">
        <div className="flex w-full flex-row items-center space-x-4">
          <div className="min-w-[100px]">
            <AspectRatio ratio={16 / 9}>
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  fill
                  alt="Thumbnail Image"
                  quality={50}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <DefaultThumbnail className="max-h-full max-w-full" />
                </div>
              )}
            </AspectRatio>
          </div>

          <span className="line-clamp-3 text-gray-400">
            {item.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="cursor-not-allowed bg-muted opacity-50">
        <div className="flex items-center justify-start space-x-2">
          <span>Processing...</span>
          <Loader2 className="animate-spin" />
        </div>
      </TableCell>
      {item.createdAt && (
        <TableCell className="cursor-not-allowed truncate bg-muted opacity-50">
          {formatDate(
            new Date(item.createdAt as string),
            'ddd. MMM. D, YYYY'
          )}
        </TableCell>
      )}
      <TableCell className="relative cursor-not-allowed bg-muted opacity-50">
        <div className="h-[15px] w-[200px] animate-pulse rounded-md bg-gray-200"></div>
      </TableCell>
      <TableCell className="cursor-not-allowed bg-muted opacity-50"></TableCell>
    </>
  )
}

export default ProcessingSkeleton
