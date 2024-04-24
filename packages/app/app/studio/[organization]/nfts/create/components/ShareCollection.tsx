'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import React, { useEffect, useState } from 'react'

const ShareCollection = ({
  collectionId,
}: {
  collectionId?: string
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
        url={`${url}/collection?collectionId=${collectionId}`}
        shareFor="nft collection"
      />
    </div>
  )
}

export default ShareCollection
