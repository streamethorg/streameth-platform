'use client'
import { ModalContext } from '../../lib/context/ModalContext'
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
import { Button } from '../Form/Button'

const ShareModalContent = () => {
  const text = `Check out this event on @streameth!`
  return (
    <div className="bg-base">
      <h1 className="font-bold uppercase mb-4 text-white text-center mx-auto pt-4">
        Share this event
      </h1>
      <div className="flex flex-row items-center justify-center space-x-4 px-4 pb-4">
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
      className="font-bold p-1  h-6 w-6  md:h-8 md:w-8 cursor-pointer ml-3 text-white border-2 border-white rounded hover:bg-accent hover:text-white "
      onClick={handleShareClick}
    />
  )
}

export const ShareWithText = ({ text }: { text: string }) => {
  const { openModal } = useContext(ModalContext)

  const handleShareClick = () => {
    openModal(<ShareModalContent />)
  }

  return (
    <div
      className="hidden text-lg bg-base text-white rounded-lg md:flex flex-row items-center justify-center space-x-4 px-4 p-2 ml-auto cursor-pointer"
      onClick={handleShareClick}>
      {text}
      <ShareIcon
        className="font-bold p-1  h-6 w-6  md:h-8 md:w-8 cursor-pointer ml-3 text-white border-2 border-white rounded hover:bg-accent hover:text-white "
        onClick={handleShareClick}
      />
    </div>
  )
}

export default ShareButton
