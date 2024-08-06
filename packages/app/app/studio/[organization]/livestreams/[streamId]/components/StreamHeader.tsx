'use client';

import { IExtendedStage } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
          <div className="mb-4 flex items-center justify-start space-x-4">
            <ArrowLeft />
            <p>Back to homepage</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default StreamHeader;
