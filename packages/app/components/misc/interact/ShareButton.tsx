'use client'
import React, { useState, useEffect } from 'react'
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { Share2 } from 'lucide-react'
import {
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share'
import { Badge } from '@/components/ui/badge'

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/crezenda'

export const ShareModalContent = () => {
  const text = `Check out this event on @streameth!`
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle className="text-center">
          Share this event
        </CredenzaTitle>
        <CredenzaDescription>
          Share this event with your friends and followers, tag
          @streameth and earn rewards!
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <div className="flex flex-row justify-center items-center px-4 pb-4 space-x-4">
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
      </CredenzaBody>
      <CredenzaFooter>
        <></>
      </CredenzaFooter>
    </CredenzaContent>
  )
}

const ShareButton = () => {
  return (
    <Credenza>
      <CredenzaTrigger>
        <Badge>
          <Share2 size={24} className="p-1" />
          Share
        </Badge>
      </CredenzaTrigger>
      <ShareModalContent />
    </Credenza>
  )
}

export default ShareButton
