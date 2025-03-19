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
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { canUseFeature } from '@/lib/utils/subscription';
import { AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Internal components
const TargetName = ({ socialId }: { socialId: string }) => {
  const { organization } = useOrganizationContext();
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
}) => {
  const { organization } = useOrganizationContext();
  const canMultistream = canUseFeature(organization, 'isMultistreamEnabled');

  return (
    <Card className="bg-white border-none shadow-none">
      <CardContent className="flex flex-col justify-between items-center p-3 space-y-2 lg:p-6">
        {canMultistream ? (
          <>
            <p className="text-muted-foreground">You have no destinations yet</p>
            <CreateMultistreamTarget
              btnName="Add First Destination"
              streamId={streamId}
              stageId={stageId}
              streamTargets={[]}
            />
          </>
        ) : (
          <div className="text-center">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center gap-2 text-amber-800 font-medium mb-2">
                <Lock className="h-4 w-4" /> 
                <span>Multistreaming Feature Locked</span>
              </div>
              <p className="text-amber-700 text-sm mb-3">
                Multistreaming is available in the Pro and Studio subscription tiers.
              </p>
              <Link href={`/studio/${organization._id}/payments`}>
                <Button size="sm" variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
                  Upgrade Subscription
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
