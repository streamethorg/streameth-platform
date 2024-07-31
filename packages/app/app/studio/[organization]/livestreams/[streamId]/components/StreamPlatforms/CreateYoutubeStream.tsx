'use client';
import { Button } from '@/components/ui/button';
import { IExtendedOrganization } from '@/lib/types';
import React, { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';

const CreateYoutubeStream = ({
  organization,
}: {
  organization: IExtendedOrganization;
}) => {
  const [socialId, setSocialId] = useState('');
  return (
    <div>
      <div>
        <p className="font-medium">Select Youtube Destination</p>

        <div className="flex flex-wrap items-center gap-5 py-5">
          {organization?.socials
            ?.filter((s) => s.type == 'youtube')
            .map(({ name, thumbnail, _id }) => (
              <div
                onClick={() => setSocialId(_id!)}
                key={_id}
                className={`flex cursor-pointer flex-col items-center ${
                  socialId == _id ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="h-14 w-14 cursor-pointer rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${thumbnail})`,
                  }}
                ></div>
                <p className="line-clamp-1 text-sm">{name}</p>
              </div>
            ))}
          <div className="flex cursor-pointer flex-col items-center">
            <CiCirclePlus color="#000" size={56} />
            <p className="text-sm">Add New</p>
          </div>
        </div>

        <div className="text-right">
          <Button disabled={!socialId} variant={'primary'}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateYoutubeStream;
