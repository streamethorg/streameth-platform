'use client'

import { TableCell } from '@/components/ui/table'
import { IExtendedSession, eLayout } from '@/lib/types'
import {
  ChevronDown,
  EllipsisVertical,
  Earth,
  Lock,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/time'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  generateThumbnailAction,
  updateSessionAction,
} from '@/lib/actions/sessions'
import ProcessingSkeleton from './misc/ProcessingSkeleton'
import { PopoverActions } from './misc/PopoverActions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import GetHashButton from './GetHashButton'
import CopyItem from '@/components/misc/CopyString'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { useEffect, useState } from 'react'

const TableCells = ({
  item,
  organization,
}: {
  item: IExtendedSession
  organization: string
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateThumbnailAction(item).then(
      (url) => url && setImageUrl(url)
    )
  }, [item])

  const handlePublishment = () => {
    setIsLoading(true)
    updateSessionAction({
      session: {
        _id: item._id,
        name: item.name,
        description: item.description,
        organizationId: item.organizationId,
        eventId: item.eventId,
        stageId: item.stageId,
        start: item.start ?? Number(new Date()),
        end: item.end ?? Number(new Date()),
        speakers: item.speakers ?? [],
        type: item.type ?? 'video',
        published: !item.published,
      },
    })
      .then(() => {
        if (item.published === true) {
          toast.success('Succesfully made your asset private')
        } else if (item.published === false) {
          toast.success('Succesfully made your asset public')
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
        toast.error('Something went wrong...')
      })
  }

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
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : item.published ? (
            <>
              <Earth size={16} />
              <p>Public</p>
            </>
          ) : (
            <>
              <Lock size={16} />
              <p>Private</p>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {isLoading ? null : <ChevronDown size={20} />}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => handlePublishment()}>
                {!item.published ? (
                  <>
                    <Earth size={16} />
                    <p>Make Public</p>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <p>Make Private</p>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <TableCell className="relative max-w-[200px]">
        {item.ipfsURI ? (
          <CopyItem item={item.ipfsURI} itemName="IPFS Uri" />
        ) : (
          <GetHashButton session={item} />
        )}
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
