import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingOption {
  name: string;
  price: string;
  description: string;
  contactLink?: string;
}

interface CustomPricingCardProps {
  option: PricingOption;
}

const CustomPricingCard: React.FC<CustomPricingCardProps> = ({ option }) => (
  <Card className="flex flex-col shadow-lg">
    <CardContent className="flex flex-grow flex-col p-6">
      <CardTitle className="mb-2 text-2xl font-bold">{option.name}</CardTitle>
      <p className="mb-4 text-sm text-muted-foreground">{option.description}</p>
      <div className="mb-6 mt-auto text-4xl font-bold">{option.price}</div>
      <Button
        className="group w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => {
          if (option.contactLink) {
            window.location.href = option.contactLink;
          }
        }}
      >
        Contact Sales
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
      </Button>
    </CardContent>
  </Card>
);

export default CustomPricingCard;
