'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../../../../components/ui/button';
import { SiGoogle } from 'react-icons/si';

const SignInWithSocials = ({ callbackUrl }: { callbackUrl: string }) => {
  const handleOnClick = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: callbackUrl,
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
    </div>
  );
};

export default SignInWithSocials;
