'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
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
        className="justify-start"
        variant="ghost"
        url={`${url}/${organization}/livestream?stage=${streamId}`}
        shareFor="livestream"
      />
    </div>
  )
}

export default ShareLivestream
