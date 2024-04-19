'use client'
import CollectionDetails from './CollectionDetails'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { nftSchema } from '@/lib/schema'
import AddMedia from './AddMedia'
import { INFTSessions } from '@/lib/types'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import {
  createNFTCollectionAction,
  updateNFTCollectionAction,
} from '@/lib/actions/nftCollection'
import PublishingNFTModal from './PublishingNFTModal'
import { toast } from 'sonner'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'

import { VideoFactoryAbi, VideoFactoryAddress } from '@/lib/contract'
import { getDateWithTime } from '@/lib/utils/time'
import { ethers } from 'ethers'
import { INftCollection } from 'streameth-new-server/src/interfaces/nft.collection.interface'

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
      symbol: '',
      mintFee: '0',
      thumbnail: '',
      startDate: new Date(),
      startTime: '',
      endDate: new Date(),
      endTime: '',
      maxSupply: '10000',
      limitedSupply: 'false',
    },
  })
  const [formState, setFormState] = useState<ICreateNFT>({
    selectedVideo: [],
  })
  const [formResponseData, setFormResponseData] =
    useState<INftCollection>()
  const [nftContractAddress, setNftContractAddress] = useState()
  const {
    data: hash,
    writeContract,
    error,
    isError,
    isPending: isCreatingNftPending,
  } = useWriteContract()

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useWatchContractEvent({
    address: VideoFactoryAddress,
    abi: VideoFactoryAbi,
    eventName: 'VideoCreated',
    onLogs(logs) {
      //@ts-ignore
      setNftContractAddress(logs[0]?.args?.videoCollectionAddress)
      console.log('New logs!', logs)
    },
  })

  const parseMintFee = ethers.parseUnits(
    form.getValues('mintFee')
      ? (form.getValues('mintFee') as string)
      : '0',
    'ether'
  )
  // Update collection with address
  const updateCollection = async () => {
    await updateNFTCollectionAction({
      //@ts-ignore
      collection: {
        ...formResponseData,
        contractAddress: nftContractAddress,
      },
    })
      .then((response) => {
        console.log('updateCollection', response)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    if (isSuccess) {
      setIsPublished(true)

      toast.success('NFT Collection successfully created')
    }

    if (nftContractAddress) {
      console.log('calling ', nftContractAddress)
      updateCollection()
    }
  }, [isSuccess, error, nftContractAddress])

  const createEventCollection = (ipfsPath?: string) => {
    writeContract({
      abi: VideoFactoryAbi,
      address: VideoFactoryAddress,
      functionName: 'createVideoCollection',
      args: [
        ipfsPath,
        form.getValues('name'),
        form.getValues('symbol'),
        Boolean(form.getValues('limitedSupply')),
        Number(form.getValues('maxSupply')),
        parseMintFee,
        getDateWithTime(
          form.getValues('startDate'),
          form.getValues('startTime')
        ).getTime(),
        getDateWithTime(
          form.getValues('endDate'),
          form.getValues('endTime')
        ).getTime(),
      ],
    })
  }

  const createNFTCollection = async () => {
    setIsPublishingCollection(true)
    const formData = {
      name: form.getValues('name'),
      description: form.getValues('description'),
      thumbnail: form.getValues('thumbnail'),
      type: type,
      organizationId: organizationId,
      videos: formState.selectedVideo.map((video) => ({
        type:
          video.videoType === 'livestreams' ? 'livestream' : 'video',
        stageId: video.videoType === 'livestreams' ? video._id : '',
        sessionId: video.videoType !== 'livestreams' ? video._id : '',
      })),
    }

    try {
      const createNFTResponse = await createNFTCollectionAction({
        nftCollection: formData,
      })
      setFormResponseData(createNFTResponse)
      createEventCollection(createNFTResponse.ipfsPath)

      form.reset()
      setStep(1)
      setFormState({ selectedVideo: [] })
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
    <div className="m-4 flex rounded-xl border border-grey overflow-auto">
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
        hash={hash}
        isCreatingNftPending={isCreatingNftPending}
        error={error as BaseError}
        isSuccess={isSuccess}
      />
    </div>
  )
}

export default CreateNFTForm
