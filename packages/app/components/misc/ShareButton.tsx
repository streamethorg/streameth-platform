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
  return (
    <DialogContent>
      <DialogTitle className="text-center">
        Share this event
      </DialogTitle>
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
    </DialogContent>
  )
}

const ShareButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Badge>
          <ShareIcon className=" p-1 h-6 w-6  md:h-8 md:w-8 cursor-pointer text-white " />
          Share
        </Badge>
      </DialogTrigger>
      <ShareModalContent />
    </Dialog>
  )
}

export default ShareButton
