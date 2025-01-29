import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceCounterProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  helpText?: string;
}

export function ResourceCounter({
  label,
  value,
  onIncrement,
  onDecrement,
  helpText
}: ResourceCounterProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">
            {value}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {helpText && (
        <p className="text-sm text-gray-600 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
} 