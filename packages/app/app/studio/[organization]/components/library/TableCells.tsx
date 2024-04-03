'use client'

import { TableCell } from '@/components/ui/table'
import { IExtendedSession } from '@/lib/types'
import { Copy } from 'lucide-react'
import { fetchEvent } from '@/lib/services/eventService'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { useState } from 'react'
import PopoverActions from './PopoverActions'
import Link from 'next/link'

const TableCells = ({
  item,
  index,
  organization,
}: {
  item: IExtendedSession
  index: number
  organization: string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    navigator.clipboard.writeText(item.ipfsURI!)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <TableCell className="font-medium">
        <p>{index + 1}</p>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="w-[100px]">
            <LibraryThumbnail session={item} />
          </div>
          <Link href={`/watch?session=${item._id}`}>
            <span className="hover:underline">{item.name}</span>
          </Link>
        </div>
      </TableCell>
      <TableCell>Private</TableCell>
      {item.createdAt && (
        <TableCell className="truncate">
          {new Date(item.createdAt).toUTCString()}
        </TableCell>
      )}
      <TableCell className="relative max-w-[200px]">
        {item.ipfsURI ? (
          <div
            className="flex items-center hover:bg-gray-200 group"
            onClick={handleCopy}>
            <span className="flex-1 m-2 rounded cursor-pointer truncate">
              {copied ? 'Copied' : item.ipfsURI}
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
        <PopoverActions session={item} organization={organization} />
      </TableCell>
    </>
  )
}

const LibraryThumbnail = async ({
  session,
}: {
  session: IExtendedSession
}) => {
  const sessionEvent = await fetchEvent({
    eventId: session.eventId as string,
  })

  return (
    <Thumbnail
      imageUrl={session.coverImage}
      fallBack={sessionEvent?.eventCover}
    />
  )
}

export default TableCells
