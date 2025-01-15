'use client';
import { IExtendedStage } from '@/lib/types';
import React from 'react';
import ShareLivestream from './ShareLivestream';
import DeleteLivestream from './DeleteLivestream';
import EditLivestream from './EditLivestream';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScissorsIcon } from 'lucide-react';
import FeatureButton from '@/components/ui/feature-button';

const LivestreamActions = ({
  stream,
  organizationSlug,
  paidStages,
  currentStages,
}: {
  stream: IExtendedStage;
  organizationSlug: string;
  paidStages: number;
  currentStages: number;
}) => {
  const isOverLimit = currentStages > paidStages;

  return (
    <div className="space-y-2 flex flex-col items-start w-full">
      {!isOverLimit && (
        <>
          <EditLivestream organizationSlug={organizationSlug} stage={stream} />
          <ShareLivestream
            organization={organizationSlug}
            variant="ghost"
            streamId={stream._id!}
          />
          {stream.streamSettings?.isActive && (
            <Link
              href={`/studio/${organizationSlug}/clips/${stream._id}?videoType=livestream`}
              className="w-full"
            >
              <FeatureButton
                organizationId={organizationSlug}
                variant="ghost"
                className="flex flex-row items-center justify-start gap-3 w-full"
              >
                <ScissorsIcon className="w-5 h-5" />
                <p>Clip</p>
              </FeatureButton>
            </Link>
          )}
        </>
      )}
      <DeleteLivestream stream={stream} />
    </div>
  );
};

export default LivestreamActions;
