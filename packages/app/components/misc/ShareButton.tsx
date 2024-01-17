'use client'
import React, { useState, useEffect } from 'react'
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { ShareIcon } from '@heroicons/react/24/outline'
import {
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share'
import { Badge } from '@/components/ui/badge'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const ShareModalContent = () => {
  const text = `Check out this event on @streameth!`
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <DialogContent>
      <DialogTitle className="text-center">
        Share this event
      </DialogTitle>
      <div className="flex flex-row items-center justify-center space-x-4 px-4 pb-4">
        <FacebookShareButton url={currentUrl} quote={text}>
          <FacebookIcon size={42} round />
        </FacebookShareButton>
        <TwitterShareButton url={currentUrl} title={text}>
          <TwitterIcon size={42} round />
        </TwitterShareButton>
        <RedditShareButton url={currentUrl} title={text}>
          <RedditIcon size={42} round />
        </RedditShareButton>
        <TelegramShareButton url={currentUrl} title={text}>
          <TelegramIcon size={42} round />
        </TelegramShareButton>
        <WhatsappShareButton url={currentUrl} title={text}>
          <WhatsappIcon size={42} round />
        </WhatsappShareButton>
      </div>
    </DialogContent>
  )
}

const ShareButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Badge className="bg-background">
          <ShareIcon className=" p-1 h-6 w-6  lg:h-8 lg:w-8 cursor-pointer text-white " />
          Share
        </Badge>
      </DialogTrigger>
      <ShareModalContent />
    </Dialog>
  )
}

export default ShareButton
