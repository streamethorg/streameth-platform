'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check } from 'lucide-react';
import PricingCard from './components/PricingCard';
import CustomPricingCard from './components/CustomPricingCard';

interface PricingOption {
  name: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  extraBenefits: string;
  monthlyStripeLink?: string;
  yearlyStripeLink?: string;
  contactLink?: string;
}

const pricingOptions: PricingOption[] = [
  {
    name: 'Starter',
    price: '$30',
    yearlyPrice: '$300',
    description:
      'Great option for individuals and small teams looking to get started with our platform.',
    features: [
      '50 hours of uploaded content',
      'Full access to all features',
      'Basic support',
    ],
    extraBenefits: '',
    monthlyStripeLink: 'https://buy.stripe.com/starter-monthly',
    yearlyStripeLink: 'https://buy.stripe.com/starter-yearly',
  },
  {
    name: 'Pro',
    price: '$300',
    yearlyPrice: '$3000',
    description:
      'Great option for medium-sized AV teams looking to improve their workflow and delivery times.',
    features: [
      'Unlimited hours of uploaded content',
      'Full access to all features',
      'Priority support',
    ],
    extraBenefits: '',
    monthlyStripeLink: 'https://buy.stripe.com/pro-monthly',
    yearlyStripeLink: 'https://buy.stripe.com/pro-yearly',
  },
  {
    name: 'Enterprise',
    price: '',
    description:
      'Customized pricing for large-scale AV teams and event organizers.',
    features: [],
    extraBenefits: '',
    contactLink: '',
  },
];

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="w-full bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Choose the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Simple, transparent pricing that grows with you
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span
              className={`font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={`font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Yearly
            </span>

            <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Save 20%
            </span>
          </div>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingOptions.map((option, index) =>
            option.name === 'Enterprise' ? (
              <CustomPricingCard key={index} option={option} />
            ) : (
              <PricingCard key={index} option={option} isYearly={isYearly} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
