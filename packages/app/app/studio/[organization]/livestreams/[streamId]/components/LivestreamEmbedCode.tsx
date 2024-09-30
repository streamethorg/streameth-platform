'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IGenerateEmbed } from '@/lib/types';
import { copyToClipboard, generateEmbedCode } from '@/lib/utils/utils';
import { Code2, Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const LivestreamEmbedCode = ({ streamId, playerName }: IGenerateEmbed) => {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin);
    }
  }, []);
  const generatedEmbedCode = generateEmbedCode({
    url: url,
    vod: false,
    stageId: streamId,
    playerName: playerName,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          Copy Embed Code
          <Code2 className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle>Embed your Livestream</DialogTitle>
          <DialogDescription>
            Paste this code into your HTML file
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between rounded-lg bg-input p-2 text-[12px]">
          <p>HTML</p>
          <div
            onClick={() => copyToClipboard(generatedEmbedCode)}
            className="flex cursor-pointer gap-2"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
            Copy Code
          </div>
        </div>
        <p className="w-full overflow-auto rounded-lg bg-input p-2 text-[12px]">
          {generatedEmbedCode}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LivestreamEmbedCode;
