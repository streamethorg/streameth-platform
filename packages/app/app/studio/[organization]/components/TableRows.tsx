'use client'

import { TableCell } from '@/components/ui/table'
import { IExtendedSession } from '@/lib/types'
import { Copy } from 'lucide-react'
import { fetchEvent } from '@/lib/services/eventService'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { useState } from 'react'
import PopoverActions from './PopoverActions'

const TableRows = ({
  item,
  index,
  organization,
  hash,
}: {
  item: IExtendedSession
  index: number
  organization: string
  hash: string | undefined
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    navigator.clipboard.writeText(hash!)
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
          <span>{item.name}</span>
        </div>
      </TableCell>
      {item.createdAt && (
        <TableCell>
          {new Date(item.createdAt).toUTCString()}
        </TableCell>
      )}
      <TableCell className="relative truncate w-[150px]">
        {hash ? (
          <div
            className="flex items-center hover:bg-gray-200 min-w-[150px] group"
            onClick={handleCopy}>
            <span className="flex-1 m-2 rounded cursor-pointer">
              {copied ? 'Copied' : hash}
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

export default TableRows
