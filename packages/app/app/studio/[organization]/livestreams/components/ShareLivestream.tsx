'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import { buttonVariants } from '@/components/ui/button'

import React, { useEffect, useState } from 'react'

const ShareLivestream = ({
  streamId,
  organization,
}: {
  organization: string
  streamId?: string
}) => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return

    setUrl(window.location.origin)
  }, [])
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ShareButton
        url={`${url}/${organization}?streamId=${streamId}`}
        livestream
        className={buttonVariants({
          variant: 'outline',
          className: 'text-black font-normal',
        })}
      />
    </div>
  )
}

export default ShareLivestream
