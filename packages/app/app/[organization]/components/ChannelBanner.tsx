'use client';

import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite';
import Image from 'next/image';
import ChannelShareIcons from './ChannelShareIcons';
import React from 'react';
import ChannelDescription from './ChannelDescription';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const ChannelBanner = () => {
  const { organization } = useOrganizationContext();
  return (
    <div className="relative w-full">
      <div className="relative z-0 w-full md:rounded-xl h-48">
        {organization.banner ? (
          <Image
            src={organization.banner}
            alt="banner"
            quality={100}
            objectFit="cover"
            className="md:rounded-xl "
            fill
            priority
          />
        ) : (
          <div className="h-full bg-gray-300 md:rounded-xl">
            <StreamethLogoWhite />
          </div>
        )}
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 w-full space-y-2 p-4 text-white">
          <div className="flex w-full flex-row justify-between">
            <div className="overflow-hidden">
              <h2 className="text-2xl font-bold">{organization.name}</h2>
              <ChannelDescription description={organization.description} />
            </div>
            <ChannelShareIcons organization={organization} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelBanner;
