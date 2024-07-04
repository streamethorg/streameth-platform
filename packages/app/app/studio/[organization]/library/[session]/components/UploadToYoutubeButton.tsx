'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IExtendedOrganization } from '@/lib/types'
import Link from 'next/link'

import React, { useState } from 'react'
import { SiYoutube } from 'react-icons/si'

const NoYoutubeChannelModal = ({
  hasChannel,
}: {
  hasChannel?: string
}) => {
  const hasNoChannel = hasChannel === 'noChannel'
  const [open, setOpen] = useState(hasNoChannel ?? false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-4">
        <h4 className="text-xl font-bold">
          Create Youtube Channel Before Continuing
        </h4>
        <p>
          To upload a video to YouTube, YouTube requires you create an
          account. goto{' '}
          <Link
            className="text-destructive"
            target="_blank"
            rel="noopener"
            href="https://www.youtube.com">
            www.youtube.com
          </Link>{' '}
          to create one, return to StreamEth to connect again.
        </p>
      </DialogContent>
    </Dialog>
  )
}

const UploadToYoutubeButton = ({
  organization,
  organizationSlug,
  sessionId,
  hasChannel,
}: {
  organization: IExtendedOrganization | null
  organizationSlug: string
  sessionId: string
  hasChannel?: string
}) => {
  const [selectedDestination, setSelectedDestination] =
    useState<string>()
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''

  const handleYoutubeClick = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        redirectUrl: `/studio/${organizationSlug}/library/${sessionId}`,
        organizationId: organization?._id,
      })
    )
    // Encode the redirect URL
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&state=${state}`
    window.location.href = authUrl
  }
  const hasSocials = organization?.socials?.length
    ? organization?.socials?.length > 0
    : false

  const handlePublish = () => {}

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="min-w-[200px] bg-[#FF0000]">
            <SiYoutube className="mr-2" />
            Publish to Youtube (Coming Soon)
          </Button>
        </DialogTrigger>
        <DialogContent className="px-8">
          <p className="font-medium">Select Youtube Destinations</p>
          {!hasSocials ? (
            <p>No linked youtube account</p>
          ) : (
            <div className="flex flex-wrap gap-5 py-5">
              {organization?.socials?.map(
                ({ name, type, thumbnail, _id }) => (
                  <div
                    onClick={() => setSelectedDestination(_id!)}
                    key={_id}
                    className={`flex cursor-pointer flex-col items-center ${
                      selectedDestination == _id
                        ? 'opacity-100'
                        : 'opacity-50'
                    }`}>
                    <div
                      className="h-14 w-14 cursor-pointer rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${thumbnail})`,
                      }}></div>
                    <p className="line-clamp-1 text-sm">{name}</p>
                  </div>
                )
              )}{' '}
            </div>
          )}

          <Button variant={'outline'} onClick={handleYoutubeClick}>
            Connect New Youtube destination
          </Button>

          <Button
            onClick={handlePublish}
            variant="outlinePrimary"
            disabled={!hasSocials || !selectedDestination}>
            Publish
          </Button>
        </DialogContent>
      </Dialog>
      <NoYoutubeChannelModal hasChannel={hasChannel} />
    </>
  )
}

export default UploadToYoutubeButton
