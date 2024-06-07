'use client'
import { buttonVariants } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { IExtendedStage } from '@/lib/types'
import React, { useEffect, useState } from 'react'

import ShareButton from '@/components/misc/interact/ShareButton'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const StreamHeader = ({
  stream,
  organization,
  isLiveStreamPage,
}: {
  stream: IExtendedStage
  organization: string
  isLiveStreamPage?: boolean
}) => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return

    setUrl(window.location.origin)
  }, [])
  return (
    <div>
      {isLiveStreamPage && (
        <Link
          href={`/studio/${organization}`}
          className="flex w-full items-center ">
          <ArrowLeft className="w-4 h-4" />
          Exit
        </Link>
      )}
    </div>
  )
}

export default StreamHeader
