'use client'
import { useEffect, useState } from 'react'
import { Code, Copy } from 'lucide-react'

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/crezenda'
import { copyToClipboard, generateEmbedCode } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'

export const EmbedModalContent: React.FC<{
  playbackId?: string
  streamId?: string
  playerName: string
  vod?: boolean
}> = ({ playbackId, streamId, playerName, vod }) => {
  const [copied, setCopied] = useState(false)
  const copiedClass = copied ? 'opacity-100' : 'opacity-0'
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000)
    }
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin)
    }
  }, [copied])

  const generatedEmbedCode = generateEmbedCode({
    url,
    playbackId,
    vod,
    streamId,
    playerName,
  })

  return (
    <CredenzaContent className="max-w-[450px]">
      <CredenzaHeader>
        <CredenzaTitle>Embed video</CredenzaTitle>
        <CredenzaDescription className="mb-4 ">
          Easily embed this stream into your website by adding the
          iframe code below
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody className="flex flex-col gap-3">
        <div className="flex p-2 rounded-lg bg-input justify-between items-center text-[12px]">
          <p>HTML</p>
          <div
            onClick={() => copyToClipboard(generatedEmbedCode)}
            className="flex gap-2 cursor-pointer">
            <Copy className="text-muted-foreground w-4 h-4" />
            Copy Code
          </div>
        </div>
        <p className="rounded-lg bg-input p-2 max-w-[400px] break-words text-[12px]">
          {generatedEmbedCode}
        </p>
      </CredenzaBody>
    </CredenzaContent>
  )
}

function EmbedButton({
  playbackId,
  streamId,
  playerName,
  vod,
  className,
}: {
  playbackId?: string
  streamId?: string
  playerName: string
  vod?: boolean
  className?: string
}) {
  return (
    <Credenza>
      <CredenzaTrigger>
        <Button className={`bg-white ${className}`} variant="outline">
          <Code size={24} className="p-1" />
          Embed
        </Button>
      </CredenzaTrigger>
      <EmbedModalContent
        vod={vod}
        playbackId={playbackId}
        streamId={streamId}
        playerName={playerName}
      />
    </Credenza>
  )
}

export default EmbedButton
