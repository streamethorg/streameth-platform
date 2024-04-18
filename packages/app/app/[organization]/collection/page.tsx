import React from 'react'
import Image from 'next/image'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'
import { OrganizationPageProps } from '@/lib/types'

const Collection = async ({
  params,
  searchParams,
}: OrganizationPageProps) => {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }
  return (
    <div>
      <div className="hidden md:block max-h-[200px] h-full aspect-video w-full">
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
    </div>
  )
}

export default Collection
