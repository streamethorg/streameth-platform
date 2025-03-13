import { useState } from 'react';
import { toast } from 'sonner';
import { acceptPayment, createCustomerPortalSession } from '@/lib/services/stripeService';
import { activateFreeTierAction } from '../actions/organizations';

interface UsePaymentProps {
  organizationId: string;
}

export const usePayment = ({ organizationId }: UsePaymentProps) => {
  const [loading, setLoading] = useState(false);
  
  // Subscription tier pricing
  // These values are used for the Stripe checkout and should match what's in Stripe
  const tierPrices = {
    free: 0,
    creator: 14.99, // Updated price
    pro: 29.99,
    studio: 79.99
  };

  // Price IDs for each tier - these must match your Stripe products
  const priceIds = {
    free: 'price_free_monthly',
    creator: 'price_creator_monthly', // Update this with your actual price ID for the creator tier product
    pro: 'price_pro_monthly',
    studio: 'price_studio_monthly'
  };

  // We're keeping these for compatibility with existing components,
  // but they're not used for pricing calculations anymore
  const [streamingDays, setStreamingDays] = useState(1);
  const [numberOfStages, setNumberOfStages] = useState(1);

  // This now returns subscription prices based on tier
  const calculateTotalPrice = (_days: number, _stages: number) => {
    // We're keeping this function for compatibility, but it's not used
    // for actual calculations anymore
    return 9.99; // Default to creator tier price
  };

  // Keep this for compatibility with existing components
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

  const handleFreeTier = async () => {
    setLoading(true);
    try {
      // Activate free tier for this organization
      await activateFreeTierAction({ organizationId });
      toast.success('Free tier activated successfully');
      
      // Force revalidation and refresh
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1500);
    } catch (error) {
      console.error('❌ Free tier activation error:', error);
      toast.error('Failed to activate free tier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);

      if (priceId === 'price_free_monthly') {
        // Free tier activation is handled differently - through server action
        try {
          await activateFreeTierAction({ organizationId });
          toast.success('Free tier activated successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (error) {
          toast.error('Failed to activate free tier. Please try again.');
        }
      } else {
        // Handle paid tier subscription through Stripe
        let tier = 'creator';
        let price = 14.99;
        
        // Set pricing based on the selected tier
        if (priceId === 'price_pro_monthly') {
          tier = 'pro';
          price = 29.99;
        } else if (priceId === 'price_studio_monthly') {
          tier = 'studio';
          price = 79.99;
        }
        
        // Create checkout session and redirect to Stripe
        const checkoutUrl = await acceptPayment(organizationId, price, tier);
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      
      // Get the current URL to use as the return URL
      const returnUrl = `${window.location.origin}/studio/${organizationId}/payments`;
      
      // Create a portal session and redirect to Stripe
      const portalUrl = await createCustomerPortalSession(organizationId, returnUrl);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Manage subscription error:', error);
      toast.error('Failed to open subscription management portal. Please try again.');
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
    handleFreeTier,
    handleManageSubscription
  };
}; 