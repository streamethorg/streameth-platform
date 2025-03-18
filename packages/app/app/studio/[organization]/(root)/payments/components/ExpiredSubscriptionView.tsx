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
  subscriptionEndDate?: Date;
  isCancelled?: boolean;
}

export const ExpiredSubscriptionView = ({
  organizationId,
  stagesStatus,
  subscriptionEndDate,
  isCancelled,
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
        {isCancelled && subscriptionEndDate ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 text-amber-600">
              <div>
                <p className="font-medium">Your subscription has been cancelled</p>
                <p className="text-sm">
                  You will continue to have access to all features until {subscriptionEndDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}. After this date, you&apos;ll be moved to the free tier.
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              You can resubscribe or change your plan at any time.
            </div>
          </div>
        ) : (
          <ExpiredSubscriptionCard />
        )}
      </Card>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isCancelled ? 'Choose a New Plan' : 'Renew Your Subscription'}
        </h2>
        <MonthlySubscriptionTiers
          loading={loading}
          onSubscribe={handleSubscribe}
          currentTier={currentTier}
        />
      </div>
    </div>
  );
}; 