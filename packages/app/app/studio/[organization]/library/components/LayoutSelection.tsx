'use client'

import Link from 'next/link'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { eLayout } from '@/lib/types'

const LayoutSelection = ({
  organizationSlug,
  currentLayout,
}: {
  organizationSlug: string
  currentLayout: eLayout
}) => {
  if (currentLayout == eLayout.grid) {
    return (
      <div className="flex justify-end space-x-2">
        <Link
          href={`/studio/${organizationSlug}/library?layout=grid`}>
          <LayoutGrid
            size={30}
            className="p-1 text-white bg-purple-500 rounded-md border transition"
          />
        </Link>
        <Link
          href={`/studio/${organizationSlug}/library?layout=list`}>
          <Rows3
            size={30}
            className="p-1 rounded-md border transition hover:text-white hover:bg-purple-500"
          />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex justify-end space-x-2">
      <Link href={`/studio/${organizationSlug}/library?layout=grid`}>
        <LayoutGrid
          size={30}
          className="p-1 rounded-md border transition hover:text-white hover:bg-purple-500"
        />
      </Link>
      <Link href={`/studio/${organizationSlug}/library?layout=list`}>
        <Rows3
          size={30}
          className="p-1 text-white bg-purple-500 rounded-md border transition"
        />
      </Link>
    </div>
  )
}

export default LayoutSelection
