import Multistream from './Multistream';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget';
import NotFound from '@/app/not-found';

const Destinations = ({
  organization,
  stream,
}: {
  organization: IExtendedOrganization;
  stream: IExtendedStage;
}) => {
  if (!stream.streamSettings?.streamId || !stream._id) {
    return NotFound();
  }

  const streamTargets = stream?.streamSettings?.targets || [];

  return (
    <div className="flex flex-col flex-grow justify-start p-4 space-y-4 h-full">
      <div className="flex justify-start space-x-2"></div>
      <Multistream
        organization={organization}
        stream={stream}
        organizationId={stream.organizationId as string}
      />
      {streamTargets.length !== 0 && (
        <CreateMultistreamTarget
          btnName="Add Destination"
          organizationId={stream.organizationId as string}
          streamId={stream?.streamSettings?.streamId}
          organization={organization}
          stageId={stream._id}
          streamTargets={stream?.streamSettings?.targets || []}
        />
      )}
    </div>
  );
};

export default Destinations;
