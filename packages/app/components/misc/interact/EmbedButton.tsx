'use client'
import { useEffect, useState } from 'react'
import { Code } from 'lucide-react'

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/crezenda'
import { Input } from '@/components/ui/input'
import { generateEmbedCode } from '@/lib/utils/utils'
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmbedCode)
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <CredenzaContent className="max-w-[450px]">
      <CredenzaHeader>
        <CredenzaTitle>Embed video</CredenzaTitle>
        <CredenzaDescription className="mb-4 text-xl">
          Easily embed this stream into your website by adding the
          iframe code below
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <Input
          disabled
          className="relative py-1 px-2 whitespace-nowrap rounded-xl cursor-pointer border-primary overflow-clip"
          onClick={copyToClipboard}
          value={generatedEmbedCode}></Input>
        <span
          className={`absolute bottom-3 left-0 right-0 flex items-center justify-center text-accent transition-opacity duration-200 ${copiedClass}`}>
          Copied to clipboard!
        </span>
      </CredenzaBody>
    </CredenzaContent>
  )
}

function EmbedButton({
  playbackId,
  streamId,
  playerName,
  vod,
}: {
  playbackId?: string
  streamId?: string
  playerName: string
  vod?: boolean
}) {
  return (
    <Credenza>
      <CredenzaTrigger>
        <Button className="bg-white" variant="outline">
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
