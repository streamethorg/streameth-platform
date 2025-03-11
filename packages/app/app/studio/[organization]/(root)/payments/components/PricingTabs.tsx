import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PricingTiers } from './PricingTiers';
import { MonthlySubscriptionTiers } from './MonthlySubscriptionTiers';

interface PricingTabsProps {
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

export function PricingTabs({
  streamingDays,
  numberOfStages,
  loading,
  totalPrice,
  onIncrementDays,
  onDecrementDays,
  onIncrementStages,
  onDecrementStages,
  onSubscribe,
}: PricingTabsProps) {
  const [activeTab, setActiveTab] = useState<'oneoff' | 'monthly'>('oneoff');

  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden" role="tablist">
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium transition-colors rounded-l-lg ${
              activeTab === 'oneoff'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('oneoff')}
          >
            One-off Event
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium transition-colors border-l border-gray-200 rounded-r-lg ${
              activeTab === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Subscription
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'oneoff' ? (
          <PricingTiers
            streamingDays={streamingDays}
            numberOfStages={numberOfStages}
            loading={loading}
            totalPrice={totalPrice}
            onIncrementDays={onIncrementDays}
            onDecrementDays={onDecrementDays}
            onIncrementStages={onIncrementStages}
            onDecrementStages={onDecrementStages}
            onSubscribe={onSubscribe}
          />
        ) : (
          <MonthlySubscriptionTiers
            loading={loading}
            onSubscribe={onSubscribe}
          />
        )}
      </div>
    </div>
  );
} 