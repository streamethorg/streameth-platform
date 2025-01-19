import { IExtendedStage } from '@/lib/types';
import React from 'react';
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
  return (
    <div>
      {isLiveStreamPage && (
        <Link href={`/studio/${organizationSlug}`}>
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
