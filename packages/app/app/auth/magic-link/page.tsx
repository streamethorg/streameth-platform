'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Loading = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold text-gray-600">Verifying...</h2>
  </div>
);

const MagicLinkPage = ({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      if (!searchParams.token || !searchParams.email) {
        router.push(
          '/auth/login?error=Error: check your email for the correct magic link or try again'
        );
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        token: searchParams.token,
        email: searchParams.email,
        redirect: false,
      });

      if (result?.error) {
        setError('Error: Failed to sign in.');
        router.push('/auth/login?error=Login failed or token expired');
      } else {
        // Redirect to /studio after successful sign-in
        router.push('/studio');
      }
      setLoading(false);
    };

    authenticate();
  }, [searchParams.token, router]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <p className="mt-2 text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return null; // Return null if everything is fine and redirecting
};

export default MagicLinkPage;
