'use client';
import { Button } from '@/components/ui/button';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';
import { deleteSession, storeSession } from '@/lib/actions/auth';
import { apiUrl } from '@/lib/utils/utils';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';

interface SignInUserButtonProps {
  className?: string;
  btnText?: string;
}

export const SignInUserButton = ({
  btnText = 'Sign in',
  className,
}: SignInUserButtonProps) => {
  const { ready, authenticated } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [privyRefreshToken, setPrivyRefreshToken] = useState<string | null>('');

  const parsePrivyRefreshToken = privyRefreshToken
    ? JSON.parse(privyRefreshToken)
    : null;

  const getSession = async () => {
    setIsLoading(true);
    const privyToken = localStorage.getItem('privy:token');
    const token = privyToken ? JSON.parse(privyToken) : null;
    const res = await fetch(`${apiUrl()}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        token: token,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const resData = await res.json();
    if (!resData.data?.token) {
      logout();
      setIsOpen(true);
      deleteSession();
    } else {
      storeSession({
        token: resData?.data?.token,
        address: resData?.data?.user?.walletAddress,
      });
      toast.message('Redirecting to Studio...');
    }
    setIsLoading(false);
  };

  const { login } = useLogin({
    onComplete: () => {
      getSession();
    },
    onError: (error) => {
      deleteSession();
      setIsLoading(false);
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      deleteSession();
      setIsLoading(false);
    },
  });

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('privy:refresh_token');
      setPrivyRefreshToken(token);
    }
  }, []);

  useEffect(() => {
    if (!parsePrivyRefreshToken) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsePrivyRefreshToken]);

  const handleClick = () => {
    setIsLoading(true);
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        disabled={!ready || isLoading}
      >
        {!ready || isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : authenticated ? (
          'Sign Out'
        ) : (
          btnText
        )}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="text-center">
          <p>User not found!</p>
          <Link
            className="text-primary text-bold"
            href={'https://xg2nwufp1ju.typeform.com/to/UHZwa5M3'}
          >
            Create Account
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
};
