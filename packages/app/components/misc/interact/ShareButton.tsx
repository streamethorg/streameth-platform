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
  XIcon,
} from 'react-share'

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
import { Button, buttonVariants } from '@/components/ui/button'
import CopyText from '@/components/misc/CopyText'

export const ShareModalContent = ({
  url,
  shareFor = 'event',
}: {
  url?: string
  shareFor?: string
}) => {
  const text = `Check out this ${shareFor} on @streameth!`
  const [currentUrl, setCurrentUrl] = useState(url ?? '')
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return
    !url && setCurrentUrl(window.location.href)
  }, [])

  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle className="text-center">
          Share this {shareFor}
        </CredenzaTitle>
        <CredenzaDescription>
          Share this {shareFor} with your friends and followers, tag
          @streameth and earn rewards!
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <div className="pb-4">
          <CopyText label="Url" text={currentUrl} />
        </div>
        <div className="flex flex-row justify-center items-center px-4 pb-4 space-x-4">
          <FacebookShareButton url={currentUrl} title={text}>
            <FacebookIcon size={42} round />
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl} title={text}>
            <XIcon size={42} round />
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

const ShareButton = ({
  url,
  className,
  variant = 'outline',
  shareFor,
  title = 'Share',
}: {
  url?: string
  className?: string
  variant?: 'outline' | 'ghost' | 'primary' | 'default'
  shareFor?: string
  title?: string
}) => {
  const buttonClassNames = buttonVariants({
    variant,
    className,
  })

  return (
    <Credenza>
      <CredenzaTrigger>
        <span className={buttonClassNames}>
          <Share2 size={24} className="p-1" />
          {title}
        </span>
      </CredenzaTrigger>
      <ShareModalContent url={url} shareFor={shareFor} />
    </Credenza>
  )
}

export default ShareButton
