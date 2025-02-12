'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const SubscriptionAlert = () => {
  const { stagesStatus } = useOrganizationContext();
  const { isOverLimit, currentStages, paidStages } = stagesStatus;

  if (isOverLimit) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You have {currentStages - paidStages} more{' '}
          {currentStages - paidStages === 1 ? 'stage' : 'stages'} than your
          subscription allows. Please delete{' '}
          {currentStages - paidStages === 1 ? 'it' : 'them'} or upgrade your
          subscription to continue using all features.
        </AlertDescription>
      </Alert>
    );
  }
};

export default SubscriptionAlert;
