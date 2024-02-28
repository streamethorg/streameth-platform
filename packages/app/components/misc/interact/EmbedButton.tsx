'use client'
import { useEffect, useState, useContext } from 'react'
import { Code } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '../ui/crezenda'
import { Input } from '../ui/input'

const ModalContent: React.FC<{
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

  const generateParams = () => {
    const params = new URLSearchParams()
    params.append('playbackId', playbackId ?? '')
    params.append('vod', vod ? 'true' : 'false')
    params.append('streamId', streamId ?? '')
    params.append('playerName', playerName ?? '')

    return params.toString()
  }

  const generateEmbedCode = () => {
    return `<iframe src="${url}/embed/?${generateParams()}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
  }

  const generatedEmbedCode = generateEmbedCode()

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
      <CredenzaFooter>
        <></>
      </CredenzaFooter>
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
        <Badge className="bg-secondary text-secondary-foreground">
          <Code size={24} className="p-1" />
          Embed
        </Badge>
      </CredenzaTrigger>
      <ModalContent
        vod={vod}
        playbackId={playbackId}
        streamId={streamId}
        playerName={playerName}
      />
    </Credenza>
  )
}

export default EmbedButton
