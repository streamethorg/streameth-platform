'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { SiX } from 'react-icons/si';

const TwitterConnectButton = ({ state }: { state?: string }) => {
  return (
    <Button disabled className="min-w-[200px] bg-[#121212]">
      <SiX className="mr-2" />X account (Coming Soon)
    </Button>
  );
};

export default TwitterConnectButton;
