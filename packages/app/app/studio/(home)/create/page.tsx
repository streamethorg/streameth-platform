'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CreateOrganizationForm from '../components/CreateOrganizationForm';
import JoinOrganizationForm from '../components/JoinOrganizationForm';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const CreateOrganization = () => {
  const [step, setStep] = useState(1);
  const [action, setAction] = useState<'create' | 'join' | null>(null);
  const { user, isLoading } = useUserContext();
  const router = useRouter();
  
  // Add a timeout to prevent getting stuck in the loading state forever
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    // If loading takes more than 3 seconds, provide a way to refresh
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setShowTimeout(true);
      }
    }, 3000);
    
    // Clean up timeout to prevent memory leaks
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading]);
  
  // Show loading state if we're explicitly in a loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {showTimeout && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Loading is taking longer than expected</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline text-sm"
            >
              Refresh the page
            </button>
          </div>
        )}
      </div>
    );
  }

  // If the page is rendered within an iframe or popup, it might cause memory issues
  // This helps detect that scenario
  useEffect(() => {
    const checkMemoryUsage = () => {
      if (performance && 'memory' in performance) {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory as any;
        const usage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        
        // If memory usage is high (over 80%), log a warning
        if (usage > 80) {
          console.warn('🚨 [Memory Warning] High memory usage:', usage.toFixed(2) + '%');
        }
      }
    };
    
    // Check every 5 seconds
    const intervalId = setInterval(checkMemoryUsage, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const renderStep1 = () => (
    <Card className="flex flex-col">
      <CardHeader>
        <Image src="/logo_dark.png" alt="streameth logo" height={250} width={200} priority />
      </CardHeader>
      <CardContent className="flex flex-row space-x-8">
        <div
          className="w-1/2 cursor-pointer hover:bg-muted hover:scale-[1.02] p-4 rounded-xl transition-all shadow-sm hover:shadow-md border border-border hover:border-primary/50"
          onClick={() => {
            setAction('create');
            setStep(2);
          }}
        >
          <h1 className="text-2xl font-medium">Create an organization</h1>
          <p className="text-sm text-muted-foreground">
            Organizations are used to manage events and videos. You can create
            multiple organizations to manage different types of events.
          </p>
        </div>

        <div
          className="w-1/2 cursor-pointer hover:bg-muted hover:scale-[1.02] p-4 rounded-xl transition-all shadow-sm hover:shadow-md border border-border hover:border-primary/50"
          onClick={() => {
            setAction('join');
            setStep(2);
          }}
        >
          <h1 className="text-2xl font-medium">Join an organization</h1>
          <p className="text-sm text-muted-foreground">
            Have an invitation code? Join an existing organization to
            collaborate with others.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full">
      <CardContent className="p-6">
        {action === 'create' ? (
          <CreateOrganizationForm />
        ) : (
          <JoinOrganizationForm />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col space-y-8">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default CreateOrganization;
