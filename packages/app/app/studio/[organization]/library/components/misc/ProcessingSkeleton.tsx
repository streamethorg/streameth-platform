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
      <TableCell className="relative font-medium">
        <div className="flex flex-row items-center space-x-4 w-full">
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
                <div className="flex justify-center items-center w-full h-full">
                  <DefaultThumbnail className="max-w-full max-h-full" />
                </div>
              )}
            </AspectRatio>
          </div>

          <span className="line-clamp-3">{item.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-start items-center space-x-2">
          <span>Processing...</span>
          <Loader2 className="animate-spin" />
        </div>
      </TableCell>
      {item.createdAt && (
        <TableCell className="truncate">
          {formatDate(
            new Date(item.createdAt as string),
            'ddd. MMM. D, YYYY'
          )}
        </TableCell>
      )}
      <TableCell className="relative">
        <div className="bg-gray-200 rounded-md animate-pulse w-[200px] h-[15px]"></div>
      </TableCell>
      <TableCell></TableCell>
    </>
  )
}

export default ProcessingSkeleton
