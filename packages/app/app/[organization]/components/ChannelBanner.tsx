import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite';
import { IExtendedOrganization } from '@/lib/types';
import Image from 'next/image';
import React from 'react';

const ChannelBanner = ({
  organization,
}: {
  organization: IExtendedOrganization;
}) => {
  return (
    <div className="relative hidden aspect-video h-full max-h-[200px] w-full md:block">
      {organization.banner ? (
        <Image
          src={organization.banner}
          alt="banner"
          quality={100}
          objectFit="cover"
          className="rounded-xl"
          fill
          priority
        />
      ) : (
        <div className="h-full max-h-[200px] rounded-xl bg-gray-300 md:rounded-none">
          <StreamethLogoWhite />
        </div>
      )}
    </div>
  );
};

export default ChannelBanner;
