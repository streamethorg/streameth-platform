'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IGenerateEmbed } from '@/lib/types'
import { copyToClipboard, generateEmbedCode } from '@/lib/utils/utils'
import { Code2, Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const LivestreamEmbedCode = ({
  playbackId,
  streamId,
  playerName,
}: IGenerateEmbed) => {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin)
    }
  }, [])
  const generatedEmbedCode = generateEmbedCode({
    url: url,
    playbackId: playbackId,
    vod: false,
    streamId: streamId,
    playerName: playerName,
  })
  return (
    <Card className="w-full shadow-none bg-white">
      <CardContent className="p-3 lg:p-6 flex justify-between items-center">
        <CardTitle className="text-xl">Embed Stream</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-1">
              <Code2 className="w-4 h-4" /> <p>Copy Embed Code</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[450px]">
            <DialogHeader>
              <DialogTitle>Embed your Livestream</DialogTitle>
              <DialogDescription>
                Paste this code into your HTML file
              </DialogDescription>
            </DialogHeader>
            <div className="flex p-2 rounded-lg bg-input justify-between items-center text-[12px]">
              <p>HTML</p>
              <div
                onClick={() => copyToClipboard(generatedEmbedCode)}
                className="flex gap-2 cursor-pointer">
                <Copy className="text-muted-foreground w-4 h-4" />
                Copy Code
              </div>
            </div>
            <p className="rounded-lg bg-input p-2 w-full text-[12px] overflow-auto">
              {generatedEmbedCode}
            </p>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default LivestreamEmbedCode
