'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SubscriptionAlert = () => {
  const { subscriptionStatus, organization, organizationId } = useOrganizationContext();
  const searchParams = useSearchParams();
  const blockedAccess = searchParams.get('blockedAccess') === 'true';
  
  // Check if the user is on free tier - they can't access livestreams
  const isFree = organization?.subscriptionTier === 'free';
  
  // We show a warning alert when the user is on free tier or when they tried to access
  // a specific livestream page and were redirected here
  if (isFree || blockedAccess) {
    return (
      <Alert variant="destructive" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
        <div className="flex gap-2 items-start">
          <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <AlertTitle className="text-amber-800">
              Livestreaming Feature Locked
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-3">Livestreaming is available in the Creator, Pro and Studio subscription tiers.</p>
              <Link href={`/studio/${organizationId}/payments`}>
                <Button variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
                  Upgrade Subscription
                </Button>
              </Link>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }
  
  // Show failed subscription alert
  if (subscriptionStatus.isFailed) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Your subscription has failed or been canceled. Some features may be limited.
          Please visit the payments page to update your subscription.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default SubscriptionAlert;
