import { MonthlySubscriptionTiers } from './MonthlySubscriptionTiers';
import { usePayment } from '@/lib/hooks/usePayment';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { Card } from '@/components/ui/card';

interface NewSubscriptionViewProps {
  organizationId: string;
}

export const NewSubscriptionView = ({ organizationId }: NewSubscriptionViewProps) => {
  const { organization } = useOrganization(organizationId);
  
  const {
    loading,
    handleSubscribe,
  } = usePayment({ organizationId });

  // Get current subscription tier if exists
  const currentTier = organization?.subscriptionTier || 'none';

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="p-6 mb-6 shadow-none">
        <h1 className="text-2xl font-bold mb-2 text-center">Choose a Subscription Plan</h1>
        <p className="text-gray-600 text-center mb-0">
          Select a subscription plan that best fits your needs
        </p>
      </Card>
      
      <div className="mt-6">
        <MonthlySubscriptionTiers
          loading={loading}
          onSubscribe={handleSubscribe}
          currentTier={currentTier}
        />
      </div>
    </div>
  );
}; 