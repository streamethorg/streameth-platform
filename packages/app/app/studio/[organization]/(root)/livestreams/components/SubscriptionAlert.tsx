'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const SubscriptionAlert = () => {
  const { organization } = useOrganizationContext();

  const currentStages = organization?.currentStages || 0;
  const paidStages = organization?.paidStages || 0;
  const isOverLimit = currentStages > paidStages;

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
