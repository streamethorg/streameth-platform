import Multistream from './Multistream';
import {  IExtendedStage } from '@/lib/types';
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget';
import NotFound from '@/app/not-found';

const Destinations = ({ stream }: { stream: IExtendedStage }) => {
  if (!stream.streamSettings?.streamId || !stream._id) {
    return NotFound();
  }

  const streamTargets = stream?.streamSettings?.targets || [];

  return (
    <div className="flex flex-col flex-grow justify-start p-4 space-y-4 h-full">
      <div className="flex justify-start space-x-2"></div>
      <Multistream stage={stream} />
      {streamTargets.length !== 0 && (
        <CreateMultistreamTarget
          btnName="Add Destination"
          streamId={stream?.streamSettings?.streamId}
          stageId={stream._id}
          streamTargets={stream?.streamSettings?.targets || []}
        />
      )}
    </div>
  );
};

export default Destinations;
