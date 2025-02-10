'use client';
import ShareButton from '@/components/misc/interact/ShareButton';
import { useUserContext } from '@/lib/context/UserContext';
import React, { useEffect, useState } from 'react';

const ShareLivestream = ({
  streamId,
  variant = 'ghost'
}: {
  variant?: 'outline' | 'ghost' | 'primary' | 'default';
  streamId: string;
}) => {
  const { organizationId } = useUserContext();
  const [url, setUrl] = useState('');
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return;

    setUrl(window.location.origin);
  }, []);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ShareButton
        className="justify-start items-center w-full gap-2"
        variant={variant}
        url={`${url}/${organizationId}/livestream?stage=${streamId}`}
        shareFor="livestream"
      />
    </div>
  );
};

export default ShareLivestream;
