'use client';

import React, { useState } from 'react';
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
import { copyToClipboard } from '@/lib/utils/utils';
import { Input } from '@/components/ui/input';

interface PlaylistShareDialogProps {
  url: string;
  trigger?: React.ReactNode;
}

export default function PlaylistShareDialog({ url, trigger }: PlaylistShareDialogProps) {
  const [open, setOpen] = useState(false);
  const shareText = `Check out this playlist on @streameth!`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Share</h3>
            <div className="flex items-center space-x-2 mb-4 relative">
              <Input value={url} readOnly className="pr-10" />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => copyToClipboard(url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-center space-x-4 px-4 pb-4">
              <FacebookShareButton url={url} hashtag="#streameth">
                <FacebookIcon size={42} round />
              </FacebookShareButton>
              <TwitterShareButton url={url} title={shareText}>
                <XIcon size={42} round />
              </TwitterShareButton>
              <RedditShareButton url={url} title={shareText}>
                <RedditIcon size={42} round />
              </RedditShareButton>
              <TelegramShareButton url={url} title={shareText}>
                <TelegramIcon size={42} round />
              </TelegramShareButton>
              <WhatsappShareButton url={url} title={shareText}>
                <WhatsappIcon size={42} round />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 