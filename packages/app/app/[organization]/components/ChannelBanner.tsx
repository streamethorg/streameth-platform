import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'
import { IExtendedOrganization } from '@/lib/types'
import Image from 'next/image'
import React from 'react'

const ChannelBanner = ({
  organization,
}: {
  organization: IExtendedOrganization
}) => {
  return (
    <div className="hidden relative md:block max-h-[200px] h-full aspect-video w-full">
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
        <div className=" bg-gray-300 rounded-xl md:rounded-none max-h-[200px] h-full">
          <StreamethLogoWhite />
        </div>
      )}
    </div>
  )
}

export default ChannelBanner
