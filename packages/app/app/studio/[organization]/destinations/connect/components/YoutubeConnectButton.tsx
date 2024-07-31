'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { SiYoutube } from 'react-icons/si';

const YoutubeConnectButton = ({
  organizationSlug,
  organizationId,
  state,
}: {
  organizationSlug: string;
  organizationId?: string;
  state?: string;
}) => {
  // const state = encodeURIComponent(
  //   JSON.stringify({
  //     redirectUrl: `/studio/${organizationSlug}/destinations`,
  //     organizationId: organizationId,
  //   })
  // );
  const handleYoutubeConnect = () => {
    // Encode the redirect URL
    // const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube&state=${state}`;
    // window.location.href = authUrl;
  };

  return (
    <Link href={`/api/google/request?state=${state}`}>
      <Button className="min-w-[200px] bg-[#FF0000]">
        <SiYoutube className="mr-2" />
        Youtube Channel
      </Button>
    </Link>
  );
};

export default YoutubeConnectButton;
