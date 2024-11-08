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

const AuthErrorPage = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col justify-center items-center w-full h-full md:w-1/2">
        <Card className="shadow-none max-w-[480px]">
          <CardHeader className="text-center lg:pb-0">
            <CardTitle className="text-2xl text-destructive">
              Authentication Failed
            </CardTitle>
            <CardDescription>
              You do not currently have access to this organization. Need
              access? Contact the StreamETH team to request access.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col justify-center items-center p-4 lg:p-4">
            <p className="mt-4 text-lg text-center">
              {'To go back to the sign-in page, '}
              <Link href="/auth/login" className="underline text-primary">
                Click here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="hidden relative w-1/2 h-full md:block bg-primary">
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

export default AuthErrorPage;
