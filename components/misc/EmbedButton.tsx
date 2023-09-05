"use client";
import { useState, useContext } from 'react'
import { ModalContext } from '../context/ModalContext'
import { CodeBracketIcon } from '@heroicons/react/24/outline'

function EmbedButton({ playbackId, streamId, playerName }: { playbackId?: string; streamId?: string; playerName: string }) {
  const [copied, setCopied] = useState(false)
  const { openModal } = useContext(ModalContext)

  const generateParams = () => {
    const params = new URLSearchParams()
    params.append('playbackId', playbackId ?? '')
    params.append('streamId', streamId ?? '')
    params.append('playerName', playerName ?? '')

    return params.toString()
  }

  const generateEmbedCode = () => {
    const url = window.location.origin
    return `<iframe src="${url}/embed/?${generateParams()}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleModalOpen = () => {
    openModal(
      <div className="flex flex-col items-center justify-center w-full h-full px-3 py-7">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-md mb-4">Easily embed this stream into your website by adding the iframe code below</span>
          <div
            className="relative bg-gray-100 px-2 py-1 border border-gray-200 w-full max-w-full overflow-hidden whitespace-nowrap cursor-pointer"
            onClick={copyToClipboard}>
            {generateEmbedCode()}
          </div>
          {copied && <span className="absolute bottom-3 left-0 right-0 flex items-center justify-center text-accent">Copied to clipboard!</span>}
        </div>
      </div>
    )
  }

  return <CodeBracketIcon className="border border-accent hover:bg-accent hover:text-white rounded p-1 cursor-pointer ml-auto h-8 w-8 text-accent font-medium" onClick={handleModalOpen} />
}

export default EmbedButton;
