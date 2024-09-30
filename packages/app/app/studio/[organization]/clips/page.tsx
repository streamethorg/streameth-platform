import {
  ClipsPageParams,
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import { notFound } from 'next/navigation';
import { fetchAllSessions } from '@/lib/data';
import { fetchStages, fetchStage } from '@/lib/services/stageService';
import { StageType } from 'streameth-new-server/src/interfaces/stage.interface';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScissorsLineDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { formatTime } from '@/lib/utils/time';
import TableSort from '@/components/misc/TableSort';

import InjectUrlInput from './components/clipOptions/InjectUrlInput';
import { LuRadar, LuRadiation, LuRadio } from 'react-icons/lu';

interface IExtendedUpdateSession extends IExtendedSession {
  stageName?: string;
}

interface ClipsConfigProps {
  organization: IExtendedOrganization;
  recording: IExtendedUpdateSession[];
  customUrlStages: IExtendedStage[];
  liveStages: IExtendedStage[];
}

const ClipsConfig = ({
  organization,
  recording,
  customUrlStages,
  liveStages,
}: ClipsConfigProps) => {
  return (
    <div className="flex flex-col items-start w-full min-h-screen px-4 md:px-8 py-6 space-y-8 overflow-auto">
      {recording?.length === 0 && liveStages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h1 className="text-2xl font-bold">
            No past Recordings or Live Stage found
          </h1>
          <p className="text-sm text-gray-500">
            There are no past recordings or live stages for this organization.
          </p>
          <Link href={`/studio/${organization.slug}?show=true`}>
            <Button className="mt-4" variant="primary">
              <LuRadio className="h-4 w-4 mr-2" />
              Create Livestream
            </Button>
          </Link>
        </div>
      )}
      {recording?.length > 0 && (
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-4">Past Recordings</h2>
          <div className="mb-10 w-full rounded-xl border bg-white p-1">
            <div className="max-h-[400px] overflow-auto">
              <Table className="rounded-xl bg-white p-1">
                <TableHeader className="sticky top-0 z-50 border-b bg-white">
                  <TableRow className="rounded-t-xl hover:bg-white">
                    <TableHead>Title</TableHead>
                    <TableHead>
                      <TableSort title="Created At" sortBy="createdAt" />
                    </TableHead>
                    <TableHead>Stage Name</TableHead>
                    <TableHead>
                      <TableSort title="Duration" sortBy="duration" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-auto">
                  {recording
                    .filter(
                      (session) =>
                        session.playback?.duration &&
                        session.playback.duration > 0
                    )
                    .map((session) => (
                      <TableRow key={session._id}>
                        <TableCell className="max-w-[500px] font-medium">
                          <Link
                            href={`/studio/${organization.slug}/clips/${session.stageId}?sessionId=${session._id}&videoType=livestream`}
                            className="hover:underline"
                          >
                            {session.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            session.createdAt as string
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span>{session.stageName ?? 'Stage not found'}</span>
                        </TableCell>
                        <TableCell>
                          {formatTime(session.playback?.duration ?? 0)}
                        </TableCell>
                        <TableCell className="my-2 flex items-center space-x-2">
                          <Link
                            href={`/studio/${organization.slug}/clips/${session.stageId}?sessionId=${session._id}&videoType=recording`}
                          >
                            <Button
                              variant="primary"
                              className="flex w-full items-center gap-1"
                            >
                              <ScissorsLineDashed className="h-4 w-4" />
                              Clip
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )}

      {/* <InjectUrlInput
        organizationSlug={organization.slug as string}
        organizationId={organization._id as string}
      /> */}

      {/* {customUrlStages.length > 0 && (
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-4">Custom URL Stages</h2>
          <div className="mb-10 w-full rounded-xl border bg-white p-1">
            <div className="max-h-[400px] overflow-auto">
              <Table className="rounded-xl bg-white p-1">
                <TableHeader className="sticky top-0 z-50 border-b bg-white">
                  <TableRow className="rounded-t-xl hover:bg-white">
                    <TableHead>Stage Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-auto">
                  {customUrlStages.map((stage) => (
                    <TableRow key={stage._id}>
                      <TableCell className="max-w-[500px] font-medium">
                        {stage.name}
                      </TableCell>
                      <TableCell className="my-2 flex items-center space-x-2">
                        <Link
                          href={`/studio/${organization.slug}/clips/${stage._id}?videoType=customUrl`}
                        >
                          <Button
                            variant="primary"
                            className="flex w-full items-center gap-1"
                          >
                            <ScissorsLineDashed className="h-4 w-4" />
                            Clip
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )} */}

      {liveStages.length > 0 && (
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-4">Active Livestreams</h2>
          <div className="mb-10 w-full rounded-xl border bg-white p-1">
            <div className="max-h-[400px] overflow-auto">
              <Table className="rounded-xl bg-white p-1">
                <TableHeader className="sticky top-0 z-50 border-b bg-white">
                  <TableRow className="rounded-t-xl hover:bg-white">
                    <TableHead>Stage Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-auto">
                  {liveStages.map((stage) => (
                    <TableRow key={stage._id}>
                      <TableCell className="max-w-[500px] font-medium">
                        {stage.name}
                      </TableCell>
                      <TableCell className="my-2 flex items-center space-x-2">
                        <Link
                          href={`/studio/${organization.slug}/clips/${stage._id}?videoType=livestream`}
                        >
                          <Button
                            variant="primary"
                            className="flex w-full items-center gap-1"
                          >
                            <ScissorsLineDashed className="h-4 w-4" />
                            Clip
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const Skeleton = () => (
  <div className="flex flex-col items-start w-full h-screen px-4 md:px-8 py-6 overflow-y-auto space-y-8">
    {[1, 2, 3].map((i) => (
      <section key={i} className="w-full">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="overflow-hidden w-full" style={{ height: '400px' }}>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    ))}
  </div>
);

const ClipsPage = async ({ params, searchParams }: ClipsPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  if (!organization) return notFound();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sessionRecordings = (
    await fetchAllSessions({ organizationSlug: params.organization })
  )?.sessions?.filter(
    (session) =>
      session?.type === 'livestream' &&
      new Date(session?.createdAt as string) > sevenDaysAgo
  );

  const stages = await fetchStages({
    organizationId: organization._id,
  });

  const customUrlStages = stages.filter(
    (stage) => stage?.type === StageType.custom
  );
  const liveStages = stages.filter((stage) => stage.streamSettings?.isActive);

  // Fetch stage details for each session
  const recording = await Promise.all(
    sessionRecordings.map(async (session) => {
      if (!session.stageId) return session; // Skip if stageId is undefined
      const stage = await fetchStage({ stage: session.stageId.toString() });
      return { ...session, stageName: stage?.name };
    })
  );

  return (
    <Suspense
      key={searchParams.videoType}
      fallback={searchParams.videoType ? <Skeleton /> : <Skeleton />}
    >
      <ClipsConfig
        organization={organization}
        recording={recording}
        customUrlStages={customUrlStages}
        liveStages={liveStages}
      />
    </Suspense>
  );
};

export default ClipsPage;
