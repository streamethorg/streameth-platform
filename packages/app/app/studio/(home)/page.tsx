'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import JoinOrganizationForm from './components/JoinOrganizationForm';
import CreateOrganizationForm from './components/CreateOrganizationForm';
import { useUserContext } from '@/lib/context/UserContext';
import { Loader2, Plus, Users } from 'lucide-react';

type Step = 'choose' | 'create' | 'join';

const Studio = () => {
  const { user, isLoading } = useUserContext();
  const organizations = user?.organizations || null;
  const [currentStep, setCurrentStep] = useState<Step>('choose');

  // Add a timeout to prevent getting stuck in the loading state forever
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // If loading takes more than 3 seconds, provide a way to refresh
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setShowTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        {showTimeout && (
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              Loading is taking longer than expected
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm hover:underline text-primary"
            >
              Refresh the page
            </button>
          </div>
        )}
      </div>
    );
  }

  // If user has organizations, show them directly
  if (organizations && organizations.length > 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex overflow-auto flex-col flex-grow p-2 m-auto w-full max-w-4xl h-full bg-background">
          <div className="flex flex-row justify-between items-center py-2 w-full">
            <CardTitle>Your organizations</CardTitle>
            <Link href="/studio/create">
              <Button className="w-full">Create Organization</Button>
            </Link>
          </div>
          <div className="flex overflow-auto flex-col space-y-2 h-full">
            {organizations?.map((organization) => (
              <Link key={organization._id} href={`/studio/${organization._id}`}>
                <Card className="flex overflow-hidden flex-row h-full rounded-xl border shadow-none border-secondary">
                  <CardHeader className="relative p-3 lg:p-3">
                    <Image
                      className="h-full rounded-full"
                      alt="logo"
                      src={organization.logo}
                      width={45}
                      height={30}
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center p-3 space-y-2 w-full h-full lg:p-3">
                    <p className="text-xl">{organization.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Choose between Create or Join
  if (currentStep === 'choose') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex overflow-auto flex-col flex-grow p-2 m-auto w-full max-w-4xl h-full bg-background">
          <div className="flex flex-col mx-auto mt-12 space-y-8 w-full max-w-4xl h-full">
            <div className="text-center space-y-4">
              <Image
                src="/logo.png"
                alt="streameth logo"
                height={60}
                width={60}
                className="mx-auto"
              />
              <h1 className="text-3xl font-medium">
                Welcome to Streameth Studio
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started by creating your own organization or joining an
                existing one to collaborate with others.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Create Organization Card */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary"
                onClick={() => setCurrentStep('create')}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    Create Organization
                  </h2>
                  <p className="text-muted-foreground">
                    Start your own organization to manage events and videos.
                    Perfect for content creators, event organizers, and teams.
                  </p>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Join Organization Card */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary"
                onClick={() => setCurrentStep('join')}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Join Organization</h2>
                  <p className="text-muted-foreground">
                    Have an invitation code? Join an existing organization to
                    collaborate with others on events and content.
                  </p>
                  <Button className="w-full" variant="outline">
                    Join with Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show the appropriate form
  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-auto flex-col flex-grow p-2 m-auto w-full max-w-4xl h-full bg-background">
        <div className="flex flex-col mx-auto mt-12 space-y-8 w-full max-w-4xl">
          {/* Back button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('choose')}
              className="flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to options</span>
            </Button>
          </div>

          {/* Form content */}
          <div className="flex flex-row flex-1 min-h-[500px]">
            <div className="p-6 space-y-4 w-1/3 rounded-l-xl bg-neutrals-100">
              <Image
                src="/logo.png"
                alt="streameth logo"
                height={50}
                width={50}
              />
              <h1 className="text-2xl font-medium">
                {currentStep === 'create'
                  ? 'Create an organization'
                  : 'Join an organization'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentStep === 'create'
                  ? 'Organizations are used to manage events and videos. You can create multiple organizations to manage different types of events.'
                  : 'Have an invitation code? Join an existing organization to collaborate with others.'}
              </p>
            </div>
            <Card className="m-auto w-2/3 bg-white rounded-r-xl border-none shadow-none h-full">
              <CardContent className="h-full p-6">
                {currentStep === 'create' ? (
                  <CreateOrganizationForm />
                ) : (
                  <JoinOrganizationForm />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
