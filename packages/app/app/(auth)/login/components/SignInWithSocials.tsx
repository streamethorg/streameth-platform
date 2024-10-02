'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../../../../components/ui/button';
import { SiApple, SiGoogle } from 'react-icons/si';

const SignInWithSocials = () => {
  const handleOnClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: '/studio',
    });
  };
  return (
    <div className="flex w-full flex-col space-y-4">
      <Button
        onClick={() => handleOnClick('google')}
        className="w-full rounded-xl border bg-white text-black gap-2"
        size="lg"
      >
        <SiGoogle className="h-5 w-5" />
        Continue with Google
      </Button>

      <Button
        onClick={() => handleOnClick('github')}
        className="flex w-full flex-row rounded-xl border bg-black text-white"
        size="lg"
      >
        <SiApple className="h-5 w-5" />
        <p className="mx-2">Continue with Apple</p>
      </Button>
    </div>
  );
};

export default SignInWithSocials;
