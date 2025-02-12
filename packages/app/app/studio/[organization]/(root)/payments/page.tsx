'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { acceptPayment } from '@/lib/services/stripeService';
import { LoadingState } from './components/LoadingState';
import { ActiveSubscriptionCard } from './components/ActiveSubscriptionCard';
import { ExpiredSubscriptionCard } from './components/ExpiredSubscriptionCard';
import { PricingTiers } from './components/PricingTiers';
import { AddResourcesCard } from './components/AddResourcesCard';
import { AlertCircle } from 'lucide-react';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

export default function PaymentsPage() {
  const { 
    organization, 
    organizationId, 
    subscriptionStatus, 
    stagesStatus,
    daysLeft 
  } = useOrganizationContext();
  
  const [loading, setLoading] = useState(false);
  const [streamingDays, setStreamingDays] = useState(1);
  const [numberOfStages, setNumberOfStages] = useState(1);

  const calculateTotalPrice = (days: number, stages: number) => {
    // If both are zero, return 0
    if (days === 0 && stages === 0) {
      return 0;
    }

    // If either is zero, use 1 in its place for calculation
    const effectiveDays = days === 0 ? 1 : days;
    const effectiveStages = stages === 0 ? 1 : stages;

    const calculatedPrice = effectiveDays * effectiveStages * 500;

    // Ensure minimum price of 500
    return Math.max(500, calculatedPrice);
  };

  const handleCounter = (
    type: 'days' | 'stages',
    operation: 'increment' | 'decrement'
  ) => {
    if (type === 'days') {
      setStreamingDays((prev) =>
        operation === 'increment' ? prev + 1 : Math.max(0, prev - 1)
      );
    } else {
      setNumberOfStages((prev) =>
        operation === 'increment' ? prev + 1 : Math.max(0, prev - 1)
      );
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (priceId === 'contact_sales') {
      toast.info('Please contact sales for enterprise pricing');
      return;
    }

    setLoading(true);
    try {
      const totalPrice = calculateTotalPrice(streamingDays, numberOfStages);
      const checkoutUrl = await acceptPayment(
        organizationId,
        totalPrice,
        streamingDays,
        numberOfStages
      );

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('❌ Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If never had a subscription, show pricing tiers
  if (organization.paymentStatus === 'none' && !organization.expirationDate) {
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
  }

  // If subscription is active
  if (subscriptionStatus.isActive) {
    // If subscription has expired, show expired notice + pricing tiers
    if (subscriptionStatus.hasExpired) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ExpiredSubscriptionCard />
            {stagesStatus.currentStages > 0 && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <p className="text-amber-600">
                  You have {stagesStatus.currentStages} existing stage
                  {stagesStatus.currentStages > 1 ? 's' : ''}. Make sure
                  to purchase enough stages in your new subscription.
                </p>
              </div>
            )}
          </div>
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
    }

    // Active subscription - show current status + add resources card
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
          {stagesStatus.isOverLimit && (
            <div className="p-4 bg-red-100 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600">
                You are using all your paid stages ({stagesStatus.currentStages} of{' '}
                {stagesStatus.paidStages}). Add more stages to create new ones.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Has had subscription before but not active - show expired notice + pricing tiers
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
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
}
