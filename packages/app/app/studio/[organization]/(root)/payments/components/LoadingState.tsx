import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading subscription details...</span>
      </div>
    </div>
  );
} 