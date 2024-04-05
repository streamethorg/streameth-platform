'use client'

import { TableCell } from '@/components/ui/table'
import { IExtendedSession, eLayout } from '@/lib/types'
import { Copy } from 'lucide-react'
import PopoverActions from './PopoverActions'
import Link from 'next/link'
import Image from 'next/image'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { formatDate } from '@/lib/utils/time'
import { toast } from 'sonner'

const TableCells = ({
  item,
  organization,
}: {
  item: IExtendedSession
  organization: string
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.ipfsURI!)
    toast.success('Copied IPFS Hash to your clipboard')
  }

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

          <Link href={`/watch?session=${item._id}`}>
            <span className="hover:underline truncate">
              {item.name}
            </span>
          </Link>
        </div>
      </TableCell>
      <TableCell>{item.published ? 'Public' : 'Private'}</TableCell>
      {item.createdAt && (
        <TableCell className="truncate">
          {formatDate(
            new Date(item.createdAt as string),
            'ddd. MMM. D, YYYY'
          )}
        </TableCell>
      )}
      <TableCell className="relative max-w-[200px]">
        {item.ipfsURI ? (
          <div
            className="flex items-center hover:bg-gray-200 group"
            onClick={handleCopy}>
            <span className="flex-1 m-2 rounded cursor-pointer truncate">
              {item.ipfsURI}
            </span>
            <Copy className="p-1 mr-2 opacity-0 group-hover:opacity-100">
              Copy IPFS Hash
            </Copy>
          </div>
        ) : (
          'No IPFS Url available'
        )}
      </TableCell>
      <TableCell>
        <PopoverActions
          session={item}
          organizationSlug={organization}
          layout={eLayout.list}
        />
      </TableCell>
    </>
  )
}

export default TableCells
