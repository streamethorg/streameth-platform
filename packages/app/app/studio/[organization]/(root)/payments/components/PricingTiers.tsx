import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceCounter } from './ResourceCounter';

const tiers = [
  {
    name: 'Small Event',
    price: '500',
    description: 'Perfect for small events and communities',
    features: [
      'During event technical support',
      'Best video quality',
      'Access to all platform features',
    ],
    priceId: 'price_basic_monthly',
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
    priceId: 'contact_sales',
  },
];

interface PricingTiersProps {
  streamingDays: number;
  numberOfStages: number;
  loading: boolean;
  totalPrice: number;
  onIncrementDays: () => void;
  onDecrementDays: () => void;
  onIncrementStages: () => void;
  onDecrementStages: () => void;
  onSubscribe: (priceId: string) => void;
}

export function PricingTiers({
  streamingDays,
  numberOfStages,
  loading,
  totalPrice,
  onIncrementDays,
  onDecrementDays,
  onIncrementStages,
  onDecrementStages,
  onSubscribe,
}: PricingTiersProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="border rounded-lg p-8 hover:shadow-lg transition-shadow flex flex-col bg-white"
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
                <span className="text-3xl font-bold">
                  ${totalPrice}
                </span>
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
              <ResourceCounter
                label="Streaming days"
                value={streamingDays}
                onIncrement={onIncrementDays}
                onDecrement={onDecrementDays}
              />
              <ResourceCounter
                label="Stages"
                value={numberOfStages}
                onIncrement={onIncrementStages}
                onDecrement={onDecrementStages}
              />
            </div>
          )}
          <Button
            onClick={() => onSubscribe(tier.priceId)}
            disabled={loading}
            variant="primary"
            className="w-full mt-6"
          >
            {loading
              ? 'Processing...'
              : tier.price === 'Custom'
              ? 'Contact Sales'
              : 'Buy Now'}
          </Button>
        </div>
      ))}
    </div>
  );
} 