'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { uploadSessionToYouTubeAction } from '@/lib/actions/sessions'
import { IExtendedOrganization } from '@/lib/types'
import React, { useState } from 'react'
import { SiYoutube } from 'react-icons/si'
import { toast } from 'sonner'
import { CiCirclePlus } from 'react-icons/ci'

const UploadToYoutubeButton = ({
  organization,
  organizationSlug,
  sessionId,
}: {
  organization: IExtendedOrganization | null
  organizationSlug: string
  sessionId: string
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [socialId, setSocialId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''

  const handleYoutubeConnect = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        redirectUrl: `/studio/${organizationSlug}/library/${sessionId}`,
        organizationId: organization?._id,
      })
    )
    // Encode the redirect URL
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&prompt=select_account&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube&state=${state}`

    // Calculate window size and position
    const width = window.innerWidth * 0.7
    const height = window.innerHeight * 0.7
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    // Open the OAuth URL in a new window
    window.open(
      authUrl,
      'YouTube OAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    )
  }
  const hasSocials = organization?.socials?.length
    ? organization?.socials?.length > 0
    : false

  const handleYoutubePublish = async () => {
    setIsLoading(true)
    try {
      const response = await uploadSessionToYouTubeAction({
        type: 'youtube',
        sessionId,
        organizationId: organization?._id as string,
        socialId,
      })

      if (response.message) {
        toast.error('Error: ' + response.message)
      } else {
        toast.success('Publish request successful')
      }
    } catch (error) {
      toast.error('Error uploading video to YouTube')
    } finally {
      setIsLoading(false)
      setOpenModal(false)
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger disabled>
        <Button disabled className="min-w-[200px] bg-[#FF0000]">
          <SiYoutube className="mr-2" />
          Publish to Youtube (Coming Soon)
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[99999999999999999] px-8">
        <p className="font-medium">Select Youtube Destination</p>

        <div className="flex flex-wrap items-center gap-5 py-5">
          {organization?.socials
            ?.filter((s) => s.type == 'youtube')
            .map(({ name, thumbnail, _id }) => (
              <div
                onClick={() => setSocialId(_id!)}
                key={_id}
                className={`flex cursor-pointer flex-col items-center ${
                  socialId == _id ? 'opacity-100' : 'opacity-50'
                }`}>
                <div
                  className="h-14 w-14 cursor-pointer rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${thumbnail})`,
                  }}></div>
                <p className="line-clamp-1 text-sm">{name}</p>
              </div>
            ))}
          <div
            onClick={handleYoutubeConnect}
            className="flex cursor-pointer flex-col items-center">
            <CiCirclePlus color="#000" size={56} />
            <p className="text-sm">Add New</p>
          </div>
        </div>

        <Button
          loading={isLoading}
          onClick={handleYoutubePublish}
          variant="primary"
          disabled={!hasSocials || !socialId}>
          Publish
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default UploadToYoutubeButton
