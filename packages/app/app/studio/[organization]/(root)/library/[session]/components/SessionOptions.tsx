'use client';

import EmbedButton from '@/components/misc/interact/EmbedButton';
import ShareButton from '@/components/misc/interact/ShareButton';
import VideoDownloadClient from '@/components/misc/VideoDownloadClient';
import { IExtendedSession } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { Button } from '@/components/ui/button';
import { LuScissors } from 'react-icons/lu';
import DropdownActions from '../../components/DropdownActions';

const SessionOptions = ({ session }: { session: IExtendedSession }) => {
  const router = useRouter();
  const { organizationId } = useOrganizationContext();
  return (
    <div className="flex flex-row w-full items-center space-x-2">
      <Button
        variant="primary"
        className="w-full"
        disabled={session.type === 'clip'}
        onClick={() => {
          router.push(`/studio/${organizationId}/clips/${session.stageId}?sessionId=${session._id}&videoType=recording`);
        }}
      >
        <LuScissors className="h-4 w-4" />
        <p>Go to editor</p>
      </Button>
      <DropdownActions session={session} asButton={true} />
    </div>
  );
  // return (
  //   <div className="flex flex-row w-full items-center gap-2">
  //     <ShareButton
  //       className="w-full"
  //       variant="outline"
  //       url={
  //         typeof window !== 'undefined'
  //           ? `${window.location.origin}/${organizationSlug}/watch?session=${sessionId}`
  //           : ''
  //       }
  //       shareFor="video"
  //     />
  //     <EmbedButton
  //       className="w-full"
  //       sessionId={sessionId}
  //       playerName={name}
  //       vod
  //     />

  //     <VideoDownloadClient
  //       className="space-x-1 border"
  //       variant={'outline'}
  //       videoName={name}
  //       assetId={assetId}
  //       collapsable={true}
  //     />
  //   </div>
  // );
};

export default SessionOptions;
