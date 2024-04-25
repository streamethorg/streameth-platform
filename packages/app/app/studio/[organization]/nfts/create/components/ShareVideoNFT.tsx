'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import React, { useEffect, useState } from 'react'

const ShareVideoNFT = ({
  collectionId,
  organization,
}: {
  organization: string
  collectionId: string
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
        url={`${url}/${organization}/collection?collectionId=${collectionId}`}
        shareFor="video collection"
      />
    </div>
  )
}

export default ShareVideoNFT
