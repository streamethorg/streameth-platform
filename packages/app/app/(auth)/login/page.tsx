import React from 'react';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import LoginBackground from '@/public/login-background.png';
import SignInWithSocials from './components/SignInWithSocials';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex h-full w-1/2 flex-col items-center justify-center">
        <Card className="max-w-[500px] shadow-none">
          <CardHeader className="text-center">
            <CardTitle>Welcome to StreamETH</CardTitle>
            <CardDescription>
              Click the sign in button to connect to StreamETH
            </CardDescription>
            <div className="flex flex-col divide-y gap-4">
              <div className="flex flex-col w-full items-center justify-center pt-[20px]">
                <SignInWithSocials />
                {/* <LoginForm /> */}
              </div>

              <div className="pt-6 text-sm">
                Don&apos;t have an account? {` `}
                <Link
                  className="text-primary text-bold"
                  href={'https://xg2nwufp1ju.typeform.com/to/UHZwa5M3'}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent>
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
      </div>
    </div>
  );
};

export default LoginPage;
