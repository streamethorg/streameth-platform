import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { SiTwitter } from 'react-icons/si';
import YoutubeConnectButton from './components/YoutubeConnectButton';
import { fetchOrganization } from '@/lib/services/organizationService';

const ConnectSocials = async ({
  params,
}: {
  params: { organization: string };
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  return (
    <div className="mx-6 h-full p-2">
      <Link href={`/studio/${params.organization}/destinations`}>
        <div className="my-4 flex items-center justify-start space-x-4">
          <LuArrowLeft />
          <p>Back to destinations</p>
        </div>
      </Link>

      <div className="flex flex-col overflow-auto rounded-xl border bg-white p-4">
        <h3 className="mb-3 text-lg font-bold">Add a destination</h3>
        <p>
          Connect an account to StreamEth. Once connected, you can stream and
          upload clips and videos to it as often as you like.
        </p>
        <div className="mt-4 flex w-fit flex-col gap-4">
          <YoutubeConnectButton
            organizationId={organization?._id}
            organizationSlug={params.organization}
          />
          <Button disabled className="min-w-[200px] bg-[#121212]">
            <SiTwitter className="mr-2" />
            X(Twitter) (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectSocials;
