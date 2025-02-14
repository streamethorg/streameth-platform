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
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const LivestreamActions = ({ stream }: { stream: IExtendedStage }) => {
  const { stagesStatus, organizationId } = useOrganizationContext();
  const { isOverLimit } = stagesStatus;

  return (
    <div className="space-y-2 flex flex-col items-start w-full">
      {!isOverLimit && (
        <>
          <EditLivestream stage={stream} />
          <ShareLivestream variant="ghost" streamId={stream._id!} />
          {stream.streamSettings?.isActive && (
            <Link
              href={`/studio/${organizationId}/clips/${stream._id}?videoType=livestream`}
              className="w-full"
            >
              <FeatureButton
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
