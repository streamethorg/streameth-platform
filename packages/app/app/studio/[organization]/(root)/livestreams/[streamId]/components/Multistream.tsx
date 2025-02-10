import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeleteMultistream from './DeleteMultistream';
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget';
import { IExtendedStage } from '@/lib/types';
import { useUserContext } from '@/lib/context/UserContext';

// Internal components
const TargetName = ({ socialId }: { socialId: string }) => {
  const { organization } = useUserContext();
  const target = organization?.socials?.find((s) => s._id === socialId);

  if (!target) return null;

  return (
    <div className="flex gap-2 items-center">
      {target.name}
      {target.type === 'youtube' ? (
        <Image
          src={'/images/youtube_social_icon_red.png'}
          alt="youtube_social_icon"
          width={20}
          height={20}
        />
      ) : (
        target.type
      )}
    </div>
  );
};

const EmptyState = ({
  stageId,
  streamId,
}: {
  stageId: string;
  streamId: string;
}) => (
  <Card className="bg-white border-none shadow-none">
    <CardContent className="flex flex-col justify-between items-center p-3 space-y-2 lg:p-6">
      <p className="text-muted-foreground">You have no destinations yet</p>
      <CreateMultistreamTarget
        btnName="Add First Destination"
        streamId={streamId}
        stageId={stageId}
        streamTargets={[]}
      />
    </CardContent>
  </Card>
);

const StreamTable = ({
  streamId,
  streamTargets,
}: {
  streamId: string;
  streamTargets: any[];
}) => (
  <Card className="bg-white shadow-none">
    <Table>
      <TableHeader className="sticky top-0 z-50 w-full">
        <TableRow className="w-full">
          <TableHead className="w-full min-w-[100px]">Name</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="overflow-scroll">
        {streamTargets?.map((target) => (
          <TableRow key={target.id}>
            <>
              <TableCell className="font-medium">
                {target?.socialId ? (
                  <TargetName socialId={target.socialId} />
                ) : (
                  target?.name
                )}
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                <DeleteMultistream streamId={streamId} targetId={target.id} />
              </TableCell>
            </>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

const Multistream = ({ stage }: { stage: IExtendedStage }) => {
  if (!stage?._id) return null;
  const { streamSettings } = stage;
  const streamId = streamSettings?.streamId || '';
  const streamTargets = streamSettings?.targets || [];
  const isEmptyState = streamTargets.length === 0;
  console.log('streamTargets', streamSettings);
  return (
    <div className="w-full">
      {isEmptyState ? (
        <EmptyState stageId={stage._id} streamId={streamId} />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <CardContent className="flex items-center justify-between !p-0">
            <CardTitle className="text-xl font-bold">
              Multistream Channels
            </CardTitle>
            <span className="text-muted-foreground">
              {streamTargets.length} active
            </span>
          </CardContent>
          <StreamTable streamId={streamId} streamTargets={streamTargets} />
        </div>
      )}
    </div>
  );
};

export default Multistream;
