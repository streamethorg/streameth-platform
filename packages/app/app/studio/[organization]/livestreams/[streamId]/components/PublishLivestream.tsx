'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IExtendedStage } from '@/lib/types'
import { toast } from 'sonner'
import { updateStageAction } from '@/lib/actions/stages'
import { Check } from 'lucide-react'

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
    <div className="flex justify-end gap-4 pb-10">
      <Button
        loading={isLoading}
        onClick={handlePublishStream}
        disabled={stream?.published || isLoading}
        variant={!stream.published ? 'outline' : 'green'}>
        {stream.published ? (
          <p className="flex gap-1 items-center">
            <Check className="w-4 h-4 text-[#1A7F37]" /> Livestream
            Published
          </p>
        ) : (
          'Publish Livestream'
        )}
      </Button>
      {stream?.published && (
        <Button
          loading={isLoading}
          onClick={handlePublishStream}
          disabled={!stream?.published || isLoading}
          variant="destructive-outline">
          Un-publish
        </Button>
      )}
    </div>
  )
}

export default PublishLivestream
