import Multistream from './Multistream';
import { IExtendedStage } from '@/lib/types';
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget';
import NotFound from '@/app/not-found';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { canUseFeature } from '@/lib/utils/subscription';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Destinations = ({ stream }: { stream: IExtendedStage }) => {
  const { organization } = useOrganizationContext();
  
  if (!stream.streamSettings?.streamId || !stream._id) {
    return NotFound();
  }

  const canMultistream = canUseFeature(organization, 'isMultistreamEnabled');
  const streamTargets = stream?.streamSettings?.targets || [];
  
  // User doesn't have access to multistreaming
  if (!canMultistream) {
    return (
      <div className="flex flex-col flex-grow justify-start p-4 space-y-4 h-full">
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 flex items-center gap-2">
            <Lock className="h-4 w-4" /> Multistreaming Feature Locked
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-3">Multistreaming is available in the Pro and Studio subscription tiers.</p>
            <p className="mb-4">Upgrade your subscription to stream to multiple platforms simultaneously.</p>
            <Link href={`/studio/${organization._id}/payments`}>
              <Button variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
                Upgrade Subscription
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
