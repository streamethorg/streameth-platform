'use client';
import { Button } from '@/components/ui/button';
import { createSocialLivestreamStageAction } from '@/lib/actions/stages';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import Link from 'next/link';
import React, { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { toast } from 'sonner';
import { TargetOutput } from 'streameth-new-server/src/interfaces/stage.interface';

const CreateYoutubeStream = ({
  organization,
  stageId,
  setIsOpen,
  streamTargets,
}: {
  organization: IExtendedOrganization;
  stageId: string;
  setIsOpen: (open: boolean) => void;
  streamTargets: TargetOutput[];
}) => {
  const [socialId, setSocialId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateYoutubeStream = async () => {
    setIsLoading(true);
    await createSocialLivestreamStageAction({
      stageId: stageId,
      socialId,
      socialType: 'youtube',
      organizationId: organization._id,
    })
      .then((response) => {
        if (!response.error) {
          toast.success('Youtube stream created');
          setIsOpen(false);
        } else {
          toast.error(
            'Error creating Youtube stream: ' + response.error.details
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error('Error creating Youtube stream' + error.details);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const state = encodeURIComponent(
    JSON.stringify({
      redirectUrl: `/studio/${organization?.slug}/livestreams/${stageId}`,
      organizationId: organization?._id,
    })
  );

  const checkIsTarget = (targetId: string): boolean => {
    return streamTargets.some((t) => t.socialId === targetId);
  };
  return (
    <div>
      <p className="font-medium">Select Youtube Destination</p>

      <div className="flex flex-wrap items-start py-5">
        {organization?.socials
          ?.filter((s) => s.type == 'youtube')
          .map(({ name, thumbnail, _id }) => (
            <div
              onClick={() => setSocialId(socialId ? '' : _id!)}
              key={_id}
              className={`relative w-[110px] flex cursor-pointer flex-col items-center  ${checkIsTarget(_id) ? 'pointer-events-none opacity-50' : ''}`}
            >
              <div
                className={`h-12 w-12 cursor-pointer rounded-full bg-cover bg-center ${
                  socialId == _id || checkIsTarget(_id)
                    ? 'outline-red-500 outline outline-4'
                    : 'outline-none'
                }`}
                style={{
                  backgroundImage: `url(${thumbnail})`,
                }}
              ></div>
              <p
                className={`text-center p-2 text-sm ${socialId == _id ? 'text-semibold' : ''}`}
              >
                {checkIsTarget(_id) ? `Streamed to ${name}` : name}
              </p>
            </div>
          ))}
        <Link
          href={`/api/google/request?state=${state}`}
          className="flex cursor-pointer flex-col items-center"
        >
          <CiCirclePlus color="#000" size={48} />
          <p className="text-sm p-2">Add New</p>
        </Link>
      </div>

      <div className="text-right">
        <Button
          loading={isLoading}
          onClick={handleCreateYoutubeStream}
          disabled={!socialId}
          variant={'primary'}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateYoutubeStream;
