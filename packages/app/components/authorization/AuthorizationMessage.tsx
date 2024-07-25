'use client';
import React, { useEffect } from 'react';
import { SignInUserButton } from '../misc/SignInUserButton';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

import LoginBackground from '@/public/login-background.png';
import Image from 'next/image';

import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';

import Link from 'next/link';
import SignInWithSocials from './SignInWithSocials';

const AuthorizationMessage = () => {
  const { ready, authenticated, login } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
    if (authenticated) {
      toast.message('Redirecting to Studio...');
    }
  }, [ready, authenticated]);

  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex h-full w-1/2 flex-col items-center justify-center">
        <Card className="max-w-[500px] shadow-none">
          <CardHeader className="text-center">
            <CardTitle>Welcome to StreamETH</CardTitle>
            <CardDescription>
              Click the sign in button to connect to StreamETH
            </CardDescription>
            <div className="flex w-full items-center justify-center pt-[20px]">
              <SignInUserButton />
            </div>
          </CardHeader>

          <CardContent>
            {/* <SignInWithSocials /> */}
            <p className="mt-2 text-sm text-muted-foreground">
              By signing up you agree to the{' '}
              <Link className="underline" href="/terms">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link className="underline" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="relative h-full w-1/2 bg-primary">
        <Image
          quality={100}
          alt="login background"
          src={LoginBackground}
          layout="fill"
          objectFit="cover"
        />
        {/* <img
          src="/login-background.png"
          alt="login background"
          className="object-cover w-full h-full"
        /> */}
      </div>
      <div></div>
    </div>
  );
};

export default AuthorizationMessage;
