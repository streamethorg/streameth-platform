import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { SiTwitter } from 'react-icons/si'
import YoutubeConnectButton from './components/YoutubeConnectButton'
import { fetchOrganization } from '@/lib/services/organizationService'

const ConnectSocials = async ({
  params,
}: {
  params: { organization: string }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  return (
    <div className="p-2 mx-6 h-full">
      <Link href={`/studio/${params.organization}/destinations`}>
        <div className="flex justify-start items-center my-4  space-x-4">
          <LuArrowLeft />
          <p>Back to destinations</p>
        </div>
      </Link>

      <div className="flex flex-col bg-white rounded-xl border overflow-auto p-4">
        <h3 className="text-lg font-bold mb-3">Add a destination</h3>
        <p>
          Connect an account to StreamEth. Once connected, you can
          stream and upload clips and videos to it as often as you
          like.
        </p>
        <div className="mt-4 flex flex-col gap-4 w-fit">
          <YoutubeConnectButton
            organizationId={organization?._id}
            organizationSlug={params.organization}
          />
          <Button disabled className="bg-[#121212] min-w-[200px]">
            <SiTwitter className="mr-2" />
            X(Twitter) (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectSocials
