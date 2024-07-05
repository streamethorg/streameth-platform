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
  generateNFTCollectionMetadataAction,
} from '@/lib/actions/nftCollection'
import PublishingNFTModal from './PublishingNFTModal'
import { toast } from 'sonner'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useTransactionReceipt,
  useChainId,
  useSwitchChain,
} from 'wagmi'

import {
  VideoFactoryAbi,
  VideoFactoryAddress,
  contractChainID,
} from '@/lib/contract'
import { ethers } from 'ethers'
import {
  INftCollection,
  NftCollectionType,
} from 'streameth-new-server/src/interfaces/nft.collection.interface'
import { ConnectWalletButton } from '@/components/misc/ConnectWalletButton'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

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
  type: NftCollectionType
}) => {
  const account = useAccount()
  const chain = useChainId()
  const { switchChain, switchChainAsync } = useSwitchChain()

  const [step, setStep] = useState(1)
  const [isPublishingCollection, setIsPublishingCollection] =
    useState(false)
  const [isGeneratingMetadata, setIsGeneratingMetadata] =
    useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [isTransactionApproved, setIsTransactionApproved] =
    useState(false)
  const [collectionId, setCollectionId] = useState<
    string | undefined
  >('')
  const form = useForm<z.infer<typeof nftSchema>>({
    resolver: zodResolver(nftSchema),
    defaultValues: {
      name: '',
      description: '',
      symbol: '',
      mintFee: '0',
      thumbnail: '',
      maxSupply: '10000',
      limitedSupply: 'false',
    },
  })
  const [formState, setFormState] = useState<ICreateNFT>({
    selectedVideo: [],
  })
  const [formResponseData, setFormResponseData] =
    useState<INftCollection>()

  const { data: hash, writeContract, error } = useWriteContract()

  const { isSuccess } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  })

  useEffect(() => {
    if (chain !== contractChainID)
      switchChain({ chainId: contractChainID })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain])

  const parseMintFee = ethers.parseUnits(
    form.getValues('mintFee')
      ? (form.getValues('mintFee') as string)
      : '0',
    'ether'
  )
  // Update collection with address
  const createCollection = async (address: string) => {
    await createNFTCollectionAction({
      nftCollection: {
        ...formResponseData,
        name: formResponseData?.name as string,
        contractAddress: address,
      },
    })
      .then((response) => {
        if (response) {
          setIsPublished(true)
          form.reset()
          setFormState({ selectedVideo: [] })
          setStep(1)
          setCollectionId(response?._id?.toString())
          toast.success('NFT Collection successfully created')
        } else {
          setIsPublished(false)
          setPublishError('Error creating NFT Collection')
          toast.error('Error creating NFT Collection')
        }
      })
      .catch(() => {
        toast.error('Error creating NFT Collection')
        setPublishError('Error creating collection')
      })
  }
  const result = useTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (result?.data?.logs[0]?.address) {
      createCollection(result?.data?.logs[0]?.address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.data?.logs])

  useEffect(() => {
    if (hash) {
      setIsTransactionApproved(true)
    }
  }, [hash])

  const createCollectionContract = (ipfsPath?: string) => {
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
        0,
        0,
      ],
    })
  }

  const handleWriteContract = async () => {
    const formData: INftCollection = {
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
      const collectionMetadata =
        await generateNFTCollectionMetadataAction({
          nftCollection: formData,
        })
      setIsGeneratingMetadata(false)

      setFormResponseData({
        ...formData,
        ipfsPath: collectionMetadata.ipfsPath,
        videos: collectionMetadata.videos,
      })
      createCollectionContract(collectionMetadata.ipfsPath)
    } catch (error) {
      setIsPublishingCollection(false)
      setPublishError('Error while publishing')
      toast.error('Error creating NFT Collection')
    }
  }

  const createNFTCollection = async () => {
    setIsPublished(false)
    setPublishError('')
    setIsPublishingCollection(true)
    setIsGeneratingMetadata(true)
    if (!account.address || chain !== 84532) {
      switchChainAsync(
        { chainId: contractChainID },
        {
          onSuccess: () => {
            handleWriteContract()
          },
          onError: () => {
            setIsPublishingCollection(false)
            setPublishError('Error switching chain')
          },
        }
      )
    } else {
      handleWriteContract()
    }
  }

  const handleNextButton = () => {
    if (step === 1) setStep(2)
    if (step === 2) createNFTCollection()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className=" bg-pink-600 rounded-xl items-center justify-center w-full text-white flex flex-row h-auto max-h-[88px] text-xl">
          Stream as NFT
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl bg transparent p-0 rounded-xl">
        <div className="flex rounded-lg border border-grey overflow-auto ">
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
              {step == 1 && (
                <CollectionDetails type={type} form={form} />
              )}
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
              {step === 2 &&
              !account.address &&
              !account.isConnected ? (
                <ConnectWalletButton />
              ) : (
                <Button
                  loading={isPublishingCollection}
                  disabled={
                    getFormSubmitStatus(form) ||
                    isPublishingCollection ||
                    (step == 2 && formState.selectedVideo.length < 1)
                  }
                  onClick={handleNextButton}
                  variant="outlinePrimary">
                  {step == 1
                    ? 'Continue'
                    : type == 'multiple'
                      ? 'Publish Collection'
                      : 'Publish VideoNFT'}
                </Button>
              )}
            </div>
          </div>
          <PublishingNFTModal
            open={isPublishingCollection}
            onClose={setIsPublishingCollection}
            isPublished={isPublished}
            organization={organizationSlug}
            hash={hash}
            error={error as BaseError}
            isSuccess={isSuccess}
            isTransactionApproved={isTransactionApproved}
            publishError={publishError}
            isGeneratingMetadata={isGeneratingMetadata}
            collectionId={collectionId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNFTForm
