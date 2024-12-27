'use client';
import { Button } from '@/components/ui/button';
import { useClipContext } from '../ClipContext';
import { IExtendedSession } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TopBar = ({
  title,
  organization,
}: {
  title: string;
  organization: string;
}) => {
  return (
    <div className="p-2 flex  w-full bg-white flex-row justify-between items-center">
      <h1 className="text-2xl font-bold my-auto">{title}</h1>
      <Link href={`/studio/${organization}/library?clipable=true`}>
        <Button variant="ghost" className="mb-2 px-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Button>
      </Link>
    </div>
  );
};

export default TopBar;
