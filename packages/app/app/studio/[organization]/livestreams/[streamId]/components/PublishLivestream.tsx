'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IExtendedStage } from '@/lib/types'
import { toast } from 'sonner'
import { updateStageAction } from '@/lib/actions/stages'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StreamethLogo from '@/public/logo.png'
import Image from 'next/image'

const PublishLivestream = ({
  stream,
}: {
  stream: IExtendedStage
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handlePublishStream = async () => {
    setIsLoading(true)
    updateStageAction({
      stage: { ...stream, published: !stream.published },
    })
      .then((response) => {
        if (response) {
          setIsLoading(false)
          toast.success('Stream updated')
        } else {
          toast.error('Error publishing stream')
        }
      })
      .catch(() => {
        toast.error('Error publishing stream')
        setIsLoading(false)
      })
  }

  return (
    <>
      <Button
        className=" w-full text-white flex flex-row justify-center h-auto max-h-[88px] text-xl space-x-4"
        loading={isLoading}
        onClick={handlePublishStream}
        disabled={stream?.published || isLoading}
        variant={'primary'}>
        <Image src={StreamethLogo} alt="img" width={50} height={50} />
        <span>Stream to channel</span>
      </Button>
      {stream?.published && (
        <Button
          className="bg-white"
          loading={isLoading}
          onClick={handlePublishStream}
          disabled={!stream?.published || isLoading}
          variant="destructive-outline">
          Un-publish
        </Button>
      )}
    </>
  )
}

export default PublishLivestream
