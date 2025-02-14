'use client';

import { IExtendedStage } from '@/lib/types';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const StreamHeader = ({
  stream,
  isLiveStreamPage,
}: {
  stream: IExtendedStage;
  isLiveStreamPage?: boolean;
}) => {
  const { organizationId } = useOrganizationContext();
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="pr-4 text-2xl font-bold">{stream.name}</span>

      {isLiveStreamPage && (
        <Link href={`/studio/${organizationId}`}>
          <Button variant="secondary" className="mb-2 px-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </Button>
        </Link>
      )}
    </div>
  );
};

export default StreamHeader;
