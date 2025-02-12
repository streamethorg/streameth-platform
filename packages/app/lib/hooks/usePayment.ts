import { useState } from 'react';
import { toast } from 'sonner';
import { acceptPayment } from '@/lib/services/stripeService';

interface UsePaymentProps {
  organizationId: string;
}

export const usePayment = ({ organizationId }: UsePaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [streamingDays, setStreamingDays] = useState(1);
  const [numberOfStages, setNumberOfStages] = useState(1);

  const calculateTotalPrice = (days: number, stages: number) => {
    if (days === 0 && stages === 0) {
      return 0;
    }

    const effectiveDays = days === 0 ? 1 : days;
    const effectiveStages = stages === 0 ? 1 : stages;
    const calculatedPrice = effectiveDays * effectiveStages * 500;

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

  return {
    loading,
    streamingDays,
    numberOfStages,
    calculateTotalPrice,
    handleCounter,
    handleSubscribe,
  };
}; 