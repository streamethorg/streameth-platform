import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';
import { SiX } from 'react-icons/si';
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
  const state = encodeURIComponent(
    JSON.stringify({
      redirectUrl: `/studio/${params.organization}/destinations`,
      organizationId: organization?._id,
    })
  );
  return (
    <div className="p-2 mx-6 h-full">
      <Link href={`/studio/${params.organization}/destinations`}>
        <div className="flex justify-start items-center my-4 space-x-4">
          <LuArrowLeft />
          <p>Back to destinations</p>
        </div>
      </Link>

      <div className="flex overflow-auto flex-col p-4 bg-white rounded-xl border">
        <h3 className="mb-3 text-lg font-bold">Add a destination</h3>
        <p>
          Connect an account to StreamEth. Once connected, you can stream and
          upload clips and videos to it as often as you like.
        </p>
        <div className="flex flex-col gap-4 mt-4 w-fit">
          <YoutubeConnectButton state={state} />
          {/* <Link href={`/api/twitter/request?state=${state}`}> */}
          <Button disabled className="min-w-[200px] bg-[#121212]">
            <SiX className="mr-2" />
            X(Twitter) (Coming Soon)
          </Button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default ConnectSocials;
