'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { acceptPayment } from '@/lib/services/stripeService';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { LoadingState } from './components/LoadingState';
import { ActiveSubscriptionCard } from './components/ActiveSubscriptionCard';
import { ExpiredSubscriptionCard } from './components/ExpiredSubscriptionCard';
import { PricingTiers } from './components/PricingTiers';
import { AddResourcesCard } from './components/AddResourcesCard';

export default function PaymentsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [streamingDays, setStreamingDays] = useState(1);
  const [numberOfStages, setNumberOfStages] = useState(1);
  const organizationId = params.organization;
  const {
    organization,
    loading: orgLoading,
    error: orgError,
  } = useOrganization(organizationId as string);

  const calculateTotalPrice = (days: number, stages: number) => {
    // If both are zero, return 0
    if (days === 0 && stages === 0) {
      return 0;
    }

    // If either is zero, use 1 in its place for calculation
    const effectiveDays = days === 0 ? 1 : days;
    const effectiveStages = stages === 0 ? 1 : stages;
    
    const calculatedPrice = effectiveDays * effectiveStages * 250;
    
    // Ensure minimum price of 250
    return Math.max(250, calculatedPrice);
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
        organizationId as string,
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

  if (orgLoading) {
    return <LoadingState />;
  }

  if (orgError || !organization) {
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

  // Check if organization has ever had a subscription
  const hasHadSubscription = organization.paymentStatus !== 'none' || organization.expirationDate;
  
  // If never had a subscription, show pricing tiers
  if (!hasHadSubscription) {
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

  // Check if subscription is active
  const hasActiveSubscription = organization.paymentStatus === 'active' && organization.expirationDate;
  
  if (hasActiveSubscription) {
    const expiryDate = new Date(organization.expirationDate!);
    const now = new Date();
    const daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );

    // If subscription has expired, show expired notice + pricing tiers
    if (daysLeft <= 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ExpiredSubscriptionCard />
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
            expiryDate={expiryDate}
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
      </div>
    );
  }

  // Has had subscription before but not active - show expired notice + pricing tiers
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <ExpiredSubscriptionCard />
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
