'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const YoutubeConnectButton = ({ state }: { state?: string }) => {
  return (
    <Link href={`/api/google/request?state=${state}`}>
      <Button variant={'outline'} className="bg-white min-w-[200px]">
        <Image
          src={'/images/youtube_social_icon_red.png'}
          alt="youtube_social_icon"
          className="mr-2"
          width={20}
          height={20}
        />
        Youtube Channel
      </Button>
    </Link>
  );
};

export default YoutubeConnectButton;
