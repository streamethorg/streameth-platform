'use client';
import { Button } from '@/components/ui/button';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';
import { deleteSession, storeSession } from '@/lib/actions/auth';
import { apiUrl } from '@/lib/utils/utils';
import { LuExternalLink, LuLoader2, LuUserX } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
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
    // This effect runs whenever privyRefreshToken changes
    if (privyRefreshToken === null || privyRefreshToken === undefined) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privyRefreshToken]);

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
          <LuLoader2 className="h-4 w-4 animate-spin" />
        ) : authenticated ? (
          'Sign Out'
        ) : (
          btnText
        )}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <LuUserX className="h-6 w-6 text-destructive" />
              User Not Found
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              We could not find your account. Would you like to create a new one?
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Link
                href="https://xg2nwufp1ju.typeform.com/to/UHZwa5M3"
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Create Account
                <LuExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
