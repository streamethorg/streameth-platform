'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { SiYoutube } from 'react-icons/si';

const YoutubeConnectButton = ({ state }: { state?: string }) => {
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
