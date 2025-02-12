import { PricingTiers } from './PricingTiers';
import { usePayment } from '@/lib/hooks/usePayment';

interface NewSubscriptionViewProps {
  organizationId: string;
}

export const NewSubscriptionView = ({ organizationId }: NewSubscriptionViewProps) => {
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
      <PricingTiers
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
    </div>
  );
}; 