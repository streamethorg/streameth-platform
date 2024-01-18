'use client'
import { useEffect, useState, useContext } from 'react'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

const ModalContent: React.FC<{
  playbackId?: string
  streamId?: string
  playerName: string
}> = ({ playbackId, streamId, playerName }) => {
  const [copied, setCopied] = useState(false)
  const copiedClass = copied ? 'opacity-100' : 'opacity-0'

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000)
    }
  }, [copied])

  const generateParams = () => {
    const params = new URLSearchParams()
    params.append('playbackId', playbackId ?? '')
    params.append('streamId', streamId ?? '')
    params.append('playerName', playerName ?? '')

    return params.toString()
  }

  const generateEmbedCode = () => {
    const url = window && window.location.origin
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
    <DialogContent className="max-w-[450px]">
      <div className="flex flex-col items-center justify-center w-full h-full ">
        <span className="text-xl mb-4 ">
          Easily embed this stream into your website by adding the
          iframe code below
        </span>

        <span
          className="relative max-w-[350px]   rounded-xl px-2 py-1 overflow-clip whitespace-nowrap cursor-pointer"
          onClick={copyToClipboard}>
          {generatedEmbedCode}
        </span>
        <span
          className={`absolute bottom-3 left-0 right-0 flex items-center justify-center text-accent transition-opacity duration-200 ${copiedClass}`}>
          Copied to clipboard!
        </span>
      </div>
    </DialogContent>
  )
}

function EmbedButton({
  playbackId,
  streamId,
  playerName,
}: {
  playbackId?: string
  streamId?: string
  playerName: string
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Badge className="">
          <CodeBracketIcon className="font-bold   p-1 rounded cursor-pointer h-6 w-6  lg:h-8 lg:w-8 " />
          Embed
        </Badge>
      </DialogTrigger>
      <ModalContent
        playbackId={playbackId}
        streamId={streamId}
        playerName={playerName}
      />
    </Dialog>
  )
}

export default EmbedButton
