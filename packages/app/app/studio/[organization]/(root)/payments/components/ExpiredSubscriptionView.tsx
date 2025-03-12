import { ExpiredSubscriptionCard } from './ExpiredSubscriptionCard';
import { MonthlySubscriptionTiers } from './MonthlySubscriptionTiers';
import { usePayment } from '@/lib/hooks/usePayment';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { Card } from '@/components/ui/card';

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
      </Card>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Renew Your Subscription</h2>
        <MonthlySubscriptionTiers
          loading={loading}
          onSubscribe={handleSubscribe}
          currentTier={currentTier}
        />
      </div>
    </div>
  );
}; 