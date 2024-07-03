'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { SiYoutube } from 'react-icons/si'

const YoutubeConnectButton = ({
  organizationSlug,
  organizationId,
}: {
  organizationSlug: string
  organizationId?: string
}) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''

  const handleYoutubeConnect = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        redirectUrl: `/studio/${organizationSlug}/destinations`,
        organizationId: organizationId,
      })
    )
    // Encode the redirect URL
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&state=${state}`
    window.location.href = authUrl
  }

  return (
    <Button
      onClick={handleYoutubeConnect}
      className="bg-[#FF0000] min-w-[200px]">
      <SiYoutube className="mr-2" />
      Youtube Channel
    </Button>
  )
}

export default YoutubeConnectButton
