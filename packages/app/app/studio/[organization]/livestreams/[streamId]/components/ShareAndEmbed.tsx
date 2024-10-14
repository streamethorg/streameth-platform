'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy } from 'lucide-react';
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  WhatsappIcon,
  XIcon,
} from 'react-share';
import { copyToClipboard, generateEmbedCode } from '@/lib/utils/utils';
import { Input } from '@/components/ui/input';

interface ShareAndEmbedProps {
  url?: string;
  organizationSlug: string;
  streamId: string;
  playerName: string;
}

const ShareAndEmbed: React.FC<ShareAndEmbedProps> = ({
  organizationSlug,
  streamId,
  playerName,
}) => {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  useEffect(() => {
    setCurrentUrl(
      `${window.location.origin}/${organizationSlug}/livestream?stage=${streamId}`
    );
    setEmbedCode(
      generateEmbedCode({
        url: typeof window !== 'undefined' ? window.location.origin : '',
        stageId: streamId,
        playerName: playerName,
      })
    );
  }, [streamId, playerName, organizationSlug]);

  const shareText = `Check out this livestream on @streameth!`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          Share
          <Share2 className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share or Embed Livestream</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Share</h3>
            <div className="flex items-center space-x-2 mb-4 relative">
              <Input value={currentUrl} readOnly className="pr-10" />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => copyToClipboard(currentUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-center space-x-4 px-4 pb-4">
              <FacebookShareButton url={currentUrl} hashtag="#streameth">
                <FacebookIcon size={42} round />
              </FacebookShareButton>
              <TwitterShareButton url={currentUrl} title={shareText}>
                <XIcon size={42} round />
              </TwitterShareButton>
              <RedditShareButton url={currentUrl} title={shareText}>
                <RedditIcon size={42} round />
              </RedditShareButton>
              <TelegramShareButton url={currentUrl} title={shareText}>
                <TelegramIcon size={42} round />
              </TelegramShareButton>
              <WhatsappShareButton url={currentUrl} title={shareText}>
                <WhatsappIcon size={42} round />
              </WhatsappShareButton>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Embed</h3>
            <div className="relative">
              <textarea
                readOnly
                value={embedCode}
                className="w-full h-24 p-2 text-sm bg-gray-100 rounded"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(embedCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAndEmbed;
