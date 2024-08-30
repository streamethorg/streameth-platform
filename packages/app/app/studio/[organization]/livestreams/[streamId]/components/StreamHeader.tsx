'use client';

import { IExtendedStage } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StreamHeader = ({
  stream,
  organizationSlug,
  isLiveStreamPage,
}: {
  stream: IExtendedStage;
  organizationSlug: string;
  isLiveStreamPage?: boolean;
}) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return;

    setUrl(window.location.origin);
  }, []);

  return (
    <div>
      {isLiveStreamPage && (
        <Link href={`/studio/${organizationSlug}`}>
          <Button variant="ghost" className="mb-2 px-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </Button>
        </Link>
      )}
    </div>
  );
};

export default StreamHeader;
