'use client';

import { Button } from '@/components/ui/button';
import { fetchStage } from '@/lib/services/stageService';
import {
  IExtendedMarker,
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LuArrowRight, LuScissorsLineDashed } from 'react-icons/lu';
import EditLivestream from '../../components/EditLivestream';
import ShareAndEmbed from './ShareAndEmbed';
import Sidebar from './Sidebar';
import ImportDataButton from './StageDataImport/ImportDataButton';
import ViewMarkersDialog from './StageDataImport/ViewMarkersDialog';
import StreamConfigWithPlayer from './StreamConfigWithPlayer';
import StreamHealth from './StreamHealth';

const StageControls = ({
  organization,
  stream,
  stageMarkers,
}: {
  organization: IExtendedOrganization;
  stream: IExtendedStage;
  stageMarkers: IExtendedMarker[];
}) => {
  const [isLive, setIsLive] = useState(stream?.streamSettings?.isActive);
  const streamKey = stream?.streamSettings?.streamKey;

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

    setInterval(() => {
      checkIsLive();
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream?.streamSettings?.isActive]);

  if (!streamKey) {
    return notFound();
  }
  return (
    <div>
      <StreamConfigWithPlayer stream={stream} isLive={isLive} />
      <div className="flex flex-row gap-2 items-center py-2 w-full md:flex-row md:flex-wrap md:justify-between">
        <div className="flex justify-start items-center space-x-2">
          <span className="pr-4 text-xl font-bold">{stream.name}</span>
          <StreamHealth isLive={isLive} stream={stream} />
          <EditLivestream
            stage={stream}
            organizationSlug={organization.slug!}
            variant="outline"
            btnText="Edit"
          />
          {!isLive && (
            <>
              <ImportDataButton
                markers={stageMarkers}
                organizationId={organization._id}
                stageId={stream._id as string}
                stage={stream}
              />

              <ViewMarkersDialog markers={stageMarkers} />
            </>
          )}
        </div>

        <div className="flex flex-row gap-2">
          <ShareAndEmbed
            organizationSlug={organization.slug as string}
            streamId={stream._id as string}
            playerName={stream?.name}
          />

          <Link
            href={`/${organization.slug as string}/livestream?stage=${stream._id}`}
            target="_blank"
          >
            <Button variant="outline">
              Watch
              <div>
                <LuArrowRight className="ml-1 w-5 h-5" />
              </div>
            </Button>
          </Link>

          {isLive && (
            <Link
              href={`/studio/${organization.slug as string}/clips/${stream._id}?videoType=livestream`}
            >
              <Button variant="primary" className="flex gap-1 items-center">
                Clip Live
                <LuScissorsLineDashed className="ml-1 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageControls;
