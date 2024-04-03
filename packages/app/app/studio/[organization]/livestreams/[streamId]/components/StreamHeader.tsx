'use client'
import { buttonVariants } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { IExtendedStage } from '@/lib/types'
import React, { useEffect, useState } from 'react'

import ShareButton from '@/components/misc/interact/ShareButton'

const StreamHeader = ({
  stream,
  organization,
}: {
  stream: IExtendedStage
  organization: string
}) => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return

    setUrl(window.location.origin)
  }, [])
  return (
    <div className="flex items-center justify-between w-full">
      <CardTitle>{stream.name}</CardTitle>
      <div className="flex items-center gap-4">
        <ShareButton
          url={`${url}/${organization}?streamId=${stream.streamSettings?.streamId}`}
          livestream
          className={buttonVariants({
            variant: 'outline',
            className: 'text-black bg-white font-normal',
          })}
        />
      </div>
    </div>
  )
}

export default StreamHeader
