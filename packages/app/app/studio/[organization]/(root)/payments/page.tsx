'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/utils';

const tiers = [
  {
    name: 'Basic',
    price: '49',
    description: 'Perfect for small events and communities',
    features: [
      'Up to 3 concurrent streams',
      'Basic analytics',
      'Chat support',
      'Standard video quality',
    ],
    priceId: 'price_basic_monthly'
  },
  {
    name: 'Pro',
    price: '99',
    description: 'For growing organizations with multiple events',
    features: [
      'Up to 10 concurrent streams',
      'Advanced analytics',
      'Priority support',
      'HD video quality',
      'Custom branding',
    ],
    priceId: 'price_pro_monthly'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited concurrent streams',
      'Enterprise analytics',
      '24/7 dedicated support',
      '4K video quality',
      'Custom integrations',
      'SLA guarantees',
    ],
    priceId: 'contact_sales'
  }
];

export default function PaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const organizationId = params.organization;

  const handleSubscribe = async (priceId: string) => {
    if (priceId === 'contact_sales') {
      // Handle enterprise tier differently - for now just show a message
      toast.info('Please contact sales for enterprise pricing');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll just mock the subscription
      // In production, this would make an API call to your backend
      toast.success('Subscription successful!');
      router.push(`/studio/${organizationId}/livestreams`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Select the perfect plan for your streaming needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="border rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
            <p className="text-gray-600 mb-4">{tier.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">${tier.price}</span>
              {tier.price !== 'Custom' && <span className="text-gray-600">/month</span>}
            </div>
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe(tier.priceId)}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Processing...' : tier.price === 'Custom' ? 'Contact Sales' : 'Subscribe'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 