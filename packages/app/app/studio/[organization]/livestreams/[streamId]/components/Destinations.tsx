import { Card } from '@/components/ui/card';
import Multistream from './Multistream';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget';
import NotFound from '@/app/not-found';
import EditLivestream from '../../components/EditLivestream';

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

  return (
    <Card className="flex h-full w-1/3 flex-grow flex-col justify-start space-y-4 p-4 shadow-none">
      <div className="flex justify-start space-x-2">
        <CreateMultistreamTarget
          btnName="Add Destination"
          organizationId={stream.organizationId as string}
          streamId={stream?.streamSettings?.streamId}
          organization={organization}
          stageId={stream._id}
          streamTargets={stream?.streamSettings?.targets || []}
        />
        <EditLivestream
          stage={stream}
          organizationSlug={organizationSlug}
          variant="outline"
          btnText="Edit Livestream"
        />
      </div>
      <Multistream
        organization={organization}
        stream={stream}
        organizationId={stream.organizationId as string}
      />
      {/* <PublishLivestream stream={stream} /> */}
    </Card>
  );
};

export default Destinations;
