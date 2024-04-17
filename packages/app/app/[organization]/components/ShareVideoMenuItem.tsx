'use client'
import ShareButton from '@/components/misc/interact/ShareButton'
import { buttonVariants } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

const ShareVideoMenuItem = ({ url }: { url: string }) => {
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return
    setCurrentUrl(window.location.origin)
  }, [])
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ShareButton url={`${currentUrl}/${url}`} variant="ghost" />
    </div>
  )
}

export default ShareVideoMenuItem
