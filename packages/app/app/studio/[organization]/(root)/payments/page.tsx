'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, Plus, Minus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { acceptPayment } from '@/lib/services/stripeService';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { Card } from '@/components/ui/card';

const tiers = [
  {
    name: 'Small Event',
    price: '250',
    description: 'Perfect for small events and communities',
    features: [
      'During event technical support',
      'Best video quality',
      'Access to all platform features',
    ],
    priceId: 'price_basic_monthly'
  },
  {
    name: 'Big Event',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited concurrent streams',
      '24/7 dedicated support',
      'Post-event support',
      'Custom integrations',
    ],
    priceId: 'contact_sales'
  }
];

export default function PaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [streamingDays, setStreamingDays] = useState(1);
  const [numberOfStages, setNumberOfStages] = useState(1);
  const organizationId = params.organization;
  const { organization, loading: orgLoading, error: orgError } = useOrganization(organizationId as string);

  const calculateTotalPrice = (days: number, stages: number) => {
    return days * stages * 250;
  };

  const handleCounter = (type: 'days' | 'stages', operation: 'increment' | 'decrement') => {
    if (type === 'days') {
      setStreamingDays(prev => operation === 'increment' ? prev + 1 : Math.max(1, prev - 1));
    } else {
      setNumberOfStages(prev => operation === 'increment' ? prev + 1 : Math.max(1, prev - 1));
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
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('❌ Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orgLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading subscription details...</span>
        </div>
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 max-w-2xl mx-auto bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load subscription details. Please try again later.</span>
          </div>
        </Card>
      </div>
    );
  }

  // Show active subscription details if not expired
  if (organization?.expirationDate) {
    const expiryDate = new Date(organization.expirationDate);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    // If subscription has expired, show purchase options
    if (daysLeft <= 0) {
      return (
        <div className="container mx-auto px-4 py-8">

          {/* Purchase options */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600">
              Select the perfect plan for your streaming needs
            </p>
          </div>
          {/* Rest of the purchase UI */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="border rounded-lg p-8 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  {tier.price === 'Custom' ? (
                    <div className="mb-6">
                      <span className="text-3xl font-bold">${tier.price}</span>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <span className="text-3xl font-bold">${calculateTotalPrice(streamingDays, numberOfStages)}</span>
                      <span className="text-gray-600 ml-1">total</span>
                    </div>
                  )}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tier.price !== 'Custom' && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Streaming days</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCounter('days', 'decrement')}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{streamingDays}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCounter('days', 'increment')}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Stages</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCounter('stages', 'decrement')}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{numberOfStages}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCounter('stages', 'increment')}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => handleSubscribe(tier.priceId)}
                  disabled={loading}
                  variant="primary"
                  className="w-full mt-6"
                >
                  {loading ? 'Processing...' : tier.price === 'Custom' ? 'Contact Sales' : 'Buy Now'}
                </Button>
              </div>
            ))}
            
          </div>
          <div className="mt-8 max-w-2xl mx-auto">
            <Card className="p-6 bg-amber-50">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your subscription has expired</p>
                  <p className="text-sm">Purchase a new subscription to continue streaming.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Active Subscription</h1>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stages</span>
                <span className="font-medium">{organization.paidStages} stages</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Streaming Days</span>
                <span className="font-medium">{organization.streamingDays} days</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expires</span>
                <span className="font-medium">
                  {expiryDate.toLocaleDateString()} ({daysLeft} days left)
                </span>
              </div>

              {daysLeft <= 5 && (
                <div className="flex items-center gap-2 text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Your subscription will expire soon. Consider renewing.</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show purchase options if no active subscription
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Select the perfect plan for your streaming needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="border rounded-lg p-8 hover:shadow-lg transition-shadow flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
              <p className="text-gray-600 mb-4">{tier.description}</p>
              {tier.price === 'Custom' ? (
                <div className="mb-6">
                  <span className="text-3xl font-bold">${tier.price}</span>
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-3xl font-bold">${calculateTotalPrice(streamingDays, numberOfStages)}</span>
                  <span className="text-gray-600 ml-1">total</span>
                </div>
              )}
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {tier.price !== 'Custom' && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Streaming days</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCounter('days', 'decrement')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{streamingDays}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCounter('days', 'increment')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stages</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCounter('stages', 'decrement')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{numberOfStages}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCounter('stages', 'increment')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <Button
              onClick={() => handleSubscribe(tier.priceId)}
              disabled={loading}
              variant="primary"
              className="w-full mt-6"
            >
              {loading ? 'Processing...' : tier.price === 'Custom' ? 'Contact Sales' : 'Buy Now'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 