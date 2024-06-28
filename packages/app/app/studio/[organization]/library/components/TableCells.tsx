import { TableCell } from '@/components/ui/table'
import { IExtendedSession, eLayout } from '@/lib/types'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/time'
import { fetchSessionMetrics } from '@/lib/services/sessionService'
import ProcessingSkeleton from './misc/ProcessingSkeleton'
import { PopoverActions } from './misc/PopoverActions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { generateThumbnailAction } from '@/lib/actions/sessions'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import PublishCell from './PublishCell'

const TableCells = async ({
  item,
  organization,
}: {
  item: IExtendedSession
  organization: string
}) => {
  const imageUrl = await generateThumbnailAction(item)
  const views = (
    await fetchSessionMetrics({ playbackId: item.playbackId ?? '' })
  ).viewCount

  if (!item.videoUrl) {
    return <ProcessingSkeleton item={item} />
  }

  return (
    <>
      <TableCell className="relative font-medium max-w-[500px]">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="min-w-[100px]">
            <Thumbnail
              imageUrl={item.coverImage}
              fallBack={imageUrl}
            />
          </div>

          <Link href={`library/${item._id}`}>
            <span className="hover:underline line-clamp-3">
              {item.name}
            </span>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-start items-center space-x-2">
          <PublishCell item={item} />
        </div>
      </TableCell>
      {item.updatedAt && (
        <TableCell className="truncate">
          {formatDate(
            new Date(item.updatedAt as string),
            'ddd. MMM. D, YYYY'
          )}
        </TableCell>
      )}

      <TableCell className="relative max-w-[100px]">
        {views}
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger className="z-10">
            <EllipsisVertical className="mt-2" />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <PopoverActions
              session={item}
              organizationSlug={organization}
              layout={eLayout.list}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    </>
  )
}

export default TableCells
