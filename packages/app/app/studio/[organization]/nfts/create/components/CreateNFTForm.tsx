'use client'
import CollectionDetails from './CollectionDetails'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { nftSchema } from '@/lib/schema'
import AddMedia from './AddMedia'
import { INFTSessions } from '@/lib/types'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { createNFTCollectionAction } from '@/lib/actions/nftCollection'
import PublishingNFTModal from './PublishingNFTModal'
import { toast } from 'sonner'

export interface ICreateNFT {
  selectedVideo: INFTSessions[]
}

const CreateNFTForm = ({
  organizationSlug,
  organizationId,
  videos,
  stages,
  type,
}: {
  stages: INFTSessions[]
  organizationId: string
  organizationSlug: string
  videos: INFTSessions[]
  type: string
}) => {
  const [step, setStep] = useState(1)
  const [isPublishingCollection, setIsPublishingCollection] =
    useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const form = useForm<z.infer<typeof nftSchema>>({
    resolver: zodResolver(nftSchema),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
    },
  })
  const [formState, setFormState] = useState<ICreateNFT>({
    selectedVideo: [],
  })

  const createNFTCollection = async () => {
    setIsPublishingCollection(true)
    const formData = {
      name: form.getValues('name'),
      description: form.getValues('description'),
      thumbnail: form.getValues('thumbnail'),
      type: type,
      organizationId: organizationId,
      videos: [
        formState.selectedVideo.map((video) => ({
          type: video.videoType,
          stageId: video.videoType === 'livestream' ? video._id : '',
          sessionId:
            video.videoType !== 'livestream' ? video._id : '',
        })),
      ],
    }
    try {
      form.reset()
      setFormState({ selectedVideo: [] })
      const createNFTResponse = await createNFTCollectionAction({
        nftCollection: formData,
      })

      toast.success('NFT Collection successfully created')
      setIsPublished(true)
    } catch (error) {
      setIsPublishingCollection(false)
      toast.error('Error creating NFT Collection')
    }
  }

  const handleNextButton = () => {
    if (step === 1) setStep(2)
    if (step === 2) createNFTCollection()
  }

  return (
    <div className="m-4 flex h-full rounded-xl border border-grey overflow-hidden">
      <div className="p-4 lg:p-8 bg-muted min-w-[250px] space-y-2 w-1/3 border-r border-grey">
        <p
          className={`p-2 flex gap-1 rounded-xl items-center ${
            step == 1
              ? 'bg-grey text-black font-medium'
              : 'text-muted-foreground'
          }`}>
          {step == 2 && (
            <CheckCircle2 className="text-white fill-success w-7 h-7" />
          )}{' '}
          Collection Details
        </p>
        <p
          className={`p-2 flex gap-1 rounded-xl items-center ${
            step == 2
              ? 'bg-grey text-black font-medium'
              : 'text-muted-foreground'
          }`}>
          {formState.selectedVideo.length > 0 && (
            <CheckCircle2 className="text-white fill-success w-7 h-7" />
          )}{' '}
          Add Media
        </p>
      </div>
      <div className="bg-white w-full p-4 lg:p-8 flex flex-col justify-between">
        <div>
          {step == 1 && <CollectionDetails form={form} />}
          {step == 2 && (
            <AddMedia
              setFormState={setFormState}
              formState={formState}
              videos={videos}
              stages={stages}
              type={type}
            />
          )}
        </div>

        <div className="flex gap-3 self-end mt-5">
          <Link href={`/studio/${organizationSlug}/nfts`}>
            <Button
              className="border-none shadow-none"
              variant="destructive-outline">
              Cancel
            </Button>
          </Link>
          <Button
            disabled={step == 1}
            onClick={() => setStep(1)}
            variant="outline">
            Go Back
          </Button>
          <Button
            loading={isPublishingCollection}
            disabled={
              getFormSubmitStatus(form) ||
              isPublishingCollection ||
              (step == 2 && formState.selectedVideo.length < 1)
            }
            onClick={handleNextButton}
            variant="primary">
            {step == 1 ? 'Continue' : 'Publish Collection'}
          </Button>
        </div>
      </div>
      <PublishingNFTModal
        open={isPublishingCollection}
        onClose={setIsPublishingCollection}
        isPublished={isPublished}
        organization={organizationSlug}
      />
    </div>
  )
}

export default CreateNFTForm
