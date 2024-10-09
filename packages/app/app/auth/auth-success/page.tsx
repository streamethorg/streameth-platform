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

const AuthSuccessPage = () => {
  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex h-full w-full md:w-1/2  flex-col items-center justify-center">
        <Card className="max-w-[480px] shadow-none">
          <CardHeader className="text-center lg:pb-0">
            <CardTitle className="text-2xl">Success!</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>

          <CardContent className="p-4 lg:p-4 flex flex-col items-center justify-center">
            <p className="text-lg font-medium mt-2">
              {'Please check your email inbox for sign in link.'}
            </p>

            <p className="text-sm mt-4 text-center">
              {
                "Didn't receive an email? go back to the sign-in page and try again, "
              }
              <Link href="/auth/login" className="text-primary underline">
                Click here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="relative h-full hidden md:block w-1/2 bg-primary">
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

export default AuthSuccessPage;
