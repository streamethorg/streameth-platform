import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingOption {
  name: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  extraBenefits: string;
  monthlyStripeLink?: string;
  yearlyStripeLink?: string;
}

interface PricingCardProps {
  option: PricingOption;
  isYearly: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ option, isYearly }) => (
  <Card
    className={`flex flex-col shadow-lg ${option.name === 'Pro' ? 'border-primary' : ''}`}
  >
    <CardContent className="flex flex-grow flex-col p-6">
      <CardTitle className="mb-2 text-2xl font-bold">{option.name}</CardTitle>
      <p className="mb-4 text-sm text-muted-foreground">{option.description}</p>
      <div className="mb-6 mt-auto text-4xl font-bold">
        {isYearly ? option.yearlyPrice : option.price}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          {isYearly ? '/year' : '/month'}
        </span>
      </div>
      <Button
        className="group w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => {
          if (isYearly && option.yearlyStripeLink) {
            window.location.href = option.yearlyStripeLink;
          } else if (!isYearly && option.monthlyStripeLink) {
            window.location.href = option.monthlyStripeLink;
          }
        }}
      >
        Choose Plan
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
      </Button>
      <div className="mt-6">
        {option.extraBenefits && (
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            {option.extraBenefits}
          </p>
        )}
        {option.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="mb-2 flex items-center">
            <Check className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default PricingCard;
