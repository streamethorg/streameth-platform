'use client'

import { Button } from '@/components/ui/button'
import { Code, Download, Share2 } from 'lucide-react'
import { EmbedModalContent } from '@/components/misc/interact/EmbedButton'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { Suspense } from 'react'

const SessionOptions = ({
  name,
  playbackId,
  downloadUrl,
}: {
  name: string
  playbackId: string
  downloadUrl: string
}) => {
  return (
    <div className="flex justify-end items-center my-2 space-x-2">
      <Link
        href={downloadUrl}
        download={name}
        target="_blank"
        className="flex justify-center items-center">
        <Button variant={'secondary'} className="space-x-2 border-2">
          <Download size={19} />
          <p className="hidden xl:flex">Download</p>
        </Button>
      </Link>
    </div>
  )
}

export default SessionOptions
