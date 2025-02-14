'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const SubscriptionAlert = () => {
  const { stagesStatus } = useOrganizationContext();
  const { isOverLimit } = stagesStatus;

  if (isOverLimit) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You have more stages than your subscription allows. Please delete
          some or upgrade your subscription to continue using all features.
        </AlertDescription>
      </Alert>
    );
  }
};

export default SubscriptionAlert;
