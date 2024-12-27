'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { SiX } from 'react-icons/si';

const TwitterConnectButton = ({ state }: { state?: string }) => {
  return (
    <Link href={`/api/twitter/request?state=${state}`}>
      <Button className="min-w-[200px] bg-[#121212]">
        <SiX className="mr-2" />X (Twitter)
      </Button>
    </Link>
  );
};

export default TwitterConnectButton;
