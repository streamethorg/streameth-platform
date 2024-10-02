import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { SiYoutube } from 'react-icons/si';

const Multistream = ({
  stream,
  organizationId,
  organization,
}: {
  organization: IExtendedOrganization;
  stream: IExtendedStage;
  organizationId: string;
}) => {
  if (!stream || !stream._id) return null;
  const streamTargets = stream?.streamSettings?.targets || [];

  const getTargetName = (socialId: string) => {
    if (socialId) {
      const target = organization?.socials?.find((s) => s._id === socialId);
      return (
        <div className="flex items-center gap-2">
          {target?.name}
          {target?.type === 'youtube' ? (
            <SiYoutube color="#FF0000" size={25} />
          ) : (
            target?.type
          )}
        </div>
      );
    } else return null;
  };

  return (
    <div className="w-full">
      {streamTargets?.length === 0 ? (
        <Card className="border-none bg-white shadow-none">
          <CardContent className="flex flex-col items-center justify-between space-y-2 p-3 lg:p-6">
            <p className="text-muted-foreground">
              You have no destinations yet
            </p>
            <CreateMultistreamTarget
              btnName="Add First Destination"
              organizationId={organizationId}
              organization={organization}
              streamId={stream?.streamSettings?.streamId || ''}
              stageId={stream._id}
              streamTargets={streamTargets}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <CardContent className="flex items-center justify-between !p-0">
            <CardTitle className="text-xl font-bold">
              Multistream Channels
            </CardTitle>
            <span className="text-muted-foreground">
              {streamTargets.length} active
            </span>
          </CardContent>
          <Card className="bg-white shadow-none">
            <Table>
              <TableHeader className="sticky top-0 z-50 w-full">
                <TableRow className="w-full">
                  <TableHead className="min-w-[100px] w-full">Name</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="overflow-scroll">
                {streamTargets?.map((target) => (
                  <TableRow key={target.id}>
                    <>
                      <TableCell className="font-medium">
                        {target?.socialId
                          ? getTargetName(target?.socialId)
                          : target?.name}
                      </TableCell>

                      <TableCell className="flex justify-end space-x-2">
                        <DeleteMultistream
                          streamId={stream?.streamSettings?.streamId}
                          organizationId={organizationId}
                          targetId={target.id}
                        />
                      </TableCell>
                    </>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Multistream;
