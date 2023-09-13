'use client'
import { ModalContext } from '../context/ModalContext'
import { useContext } from 'react'
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

const ShareModalContent = () => {
  const text = `Check out this event on @streameth!`
  return (
    <div>
      <h1 className="font-bold uppercase mb-4 text-accent text-center mx-auto">
        Share this event
      </h1>
      <div className="flex flex-row items-center justify-center space-x-4">
        <FacebookShareButton url={window.location.href} quote={text}>
          <FacebookIcon size={42} round />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href} title={text}>
          <TwitterIcon size={42} round />
        </TwitterShareButton>
        <RedditShareButton url={window.location.href} title={text}>
          <RedditIcon size={42} round />
        </RedditShareButton>
        <TelegramShareButton url={window.location.href} title={text}>
          <TelegramIcon size={42} round />
        </TelegramShareButton>
        <WhatsappShareButton url={window.location.href} title={text}>
          <WhatsappIcon size={42} round />
        </WhatsappShareButton>
      </div>
    </div>
  )
}

const ShareButton = () => {
  const { openModal } = useContext(ModalContext)

  const handleShareClick = () => {
    openModal(<ShareModalContent />)
  }

  return (
    <ShareIcon
      className="p-1 h-8 w-8 cursor-pointer ml-3 text-accent border border-accent rounded hover:bg-accent hover:text-white "
      onClick={handleShareClick}
    />
  )
}

export default ShareButton
