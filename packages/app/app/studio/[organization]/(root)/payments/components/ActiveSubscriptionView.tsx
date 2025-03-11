import { AlertCircle } from 'lucide-react';
import { ActiveSubscriptionCard } from './ActiveSubscriptionCard';
import { AddResourcesCard } from './AddResourcesCard';
import { usePayment } from '@/lib/hooks/usePayment';
import { IExtendedOrganization } from '@/lib/types';

interface ActiveSubscriptionViewProps {
  organization: IExtendedOrganization;
  organizationId: string;
  daysLeft: number;
  stagesStatus: {
    currentStages: number;
    paidStages: number;
    isOverLimit: boolean;
  };
}

export const ActiveSubscriptionView = ({
  organization,
  organizationId,
  daysLeft,
  stagesStatus,
}: ActiveSubscriptionViewProps) => {
  const {
    loading,
    streamingDays,
    numberOfStages,
    calculateTotalPrice,
    handleCounter,
    handleSubscribe,
  } = usePayment({ organizationId });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <ActiveSubscriptionCard
          organization={organization}
          expiryDate={new Date(organization.expirationDate!)}
          daysLeft={daysLeft}
        />
        <AddResourcesCard
          streamingDays={streamingDays}
          numberOfStages={numberOfStages}
          loading={loading}
          totalPrice={calculateTotalPrice(streamingDays, numberOfStages)}
          onIncrementDays={() => handleCounter('days', 'increment')}
          onDecrementDays={() => handleCounter('days', 'decrement')}
          onIncrementStages={() => handleCounter('stages', 'increment')}
          onDecrementStages={() => handleCounter('stages', 'decrement')}
          onSubscribe={() => handleSubscribe('price_basic_monthly')}
        />
      </div>
      
      <div className="max-w-4xl mx-auto mt-12">
        {daysLeft <= 2 && (
          <div className="p-4 bg-amber-50 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <span className="text-amber-600">Your subscription will expire soon.</span>
          </div>
        )}
        
        {stagesStatus.isOverLimit && (
          <div className="p-4 bg-red-100 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600">
              You are using all your paid stages ({stagesStatus.currentStages} of{' '}
              {stagesStatus.paidStages}). Add more stages to create new ones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 