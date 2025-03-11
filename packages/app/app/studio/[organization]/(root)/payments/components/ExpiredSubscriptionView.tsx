import { ExpiredSubscriptionCard } from './ExpiredSubscriptionCard';
import { PricingTabs } from './PricingTabs';
import { usePayment } from '@/lib/hooks/usePayment';

interface ExpiredSubscriptionViewProps {
  organizationId: string;
  stagesStatus: {
    currentStages: number;
  };
}

export const ExpiredSubscriptionView = ({
  organizationId,
  stagesStatus,
}: ExpiredSubscriptionViewProps) => {
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
      <PricingTabs
        streamingDays={streamingDays}
        numberOfStages={numberOfStages}
        loading={loading}
        totalPrice={calculateTotalPrice(streamingDays, numberOfStages)}
        onIncrementDays={() => handleCounter('days', 'increment')}
        onDecrementDays={() => handleCounter('days', 'decrement')}
        onIncrementStages={() => handleCounter('stages', 'increment')}
        onDecrementStages={() => handleCounter('stages', 'decrement')}
        onSubscribe={handleSubscribe}
      />
      
      <div className="max-w-4xl mx-auto mt-12">
        <ExpiredSubscriptionCard />
        
        {stagesStatus.currentStages > 0 && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <p className="text-amber-600">
              You have {stagesStatus.currentStages} existing stage
              {stagesStatus.currentStages > 1 ? 's' : ''}. Make sure to purchase enough
              stages in your new subscription.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 