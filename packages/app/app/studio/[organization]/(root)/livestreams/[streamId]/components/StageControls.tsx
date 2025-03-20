'use client';

import { Button } from '@/components/ui/button';
import { fetchStage } from '@/lib/services/stageService';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LuArrowRight, LuScissorsLineDashed } from 'react-icons/lu';
import EditLivestream from '../../components/EditLivestream';
import ShareAndEmbed from './ShareAndEmbed';
import StreamConfigWithPlayer from './StreamConfigWithPlayer';
import StreamHealth from './StreamHealth';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const StageControls = ({ stream }: { stream: IExtendedStage }) => {
  const { organizationId, organization } = useOrganizationContext();
  const [isLive, setIsLive] = useState(stream?.streamSettings?.isActive);
  const streamKey = stream?.streamSettings?.streamKey;

  // Check if user is on free tier - they shouldn't have access to this page
  const isFree = organization?.subscriptionTier === 'free';
  
  // If free tier, redirect to livestreams page with blocked access parameter
  if (isFree) {
    redirect(`/studio/${organizationId}/livestreams?blockedAccess=true`);
  }

  const checkIsLive = async () => {
    try {
      const res = await fetchStage({ stage: stream._id as string });
      setIsLive(res?.streamSettings?.isActive);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stream?.streamSettings?.isActive) {
      return;
    }

    const interval = setInterval(() => {
      checkIsLive();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream?.streamSettings?.isActive]);

  if (!streamKey) {
    return notFound();
  }
  return (
    <div>
      <StreamConfigWithPlayer stream={stream} isLive={isLive} />
      <div className="flex flex-col md:justify-between gap-2 items-center py-2 w-full md:flex-row md:flex-wrap">
        <div className="flex flex-row w-full">
          <div className="justify-self-start flex items-center">
            <StreamHealth isLive={isLive} stream={stream} />
          </div>
          <div className="ml-auto justify-self-end flex flex-row gap-2">
            <EditLivestream stage={stream} variant="outline" btnText="Edit" />
            <ShareAndEmbed
              streamId={stream._id as string}
              playerName={stream?.name}
            />

            <Link
              href={`/${organizationId}/livestream?stage=${stream._id}`}
              target="_blank"
            >
              <Button variant="outline">
                Watch
                <LuArrowRight className="ml-1 w-5 h-5" />
              </Button>
            </Link>

            {isLive ? (
              <Link
                href={`/studio/${organizationId}/clips/${stream._id}?videoType=livestream`}
                target="_blank"
              >
                <Button variant="primary" className="flex gap-1 items-center">
                  Clip Live
                  <LuScissorsLineDashed className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button variant="primary" disabled>
                Clip Live
                <LuScissorsLineDashed className="ml-1 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageControls;
