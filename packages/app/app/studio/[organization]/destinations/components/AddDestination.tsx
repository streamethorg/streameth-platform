'use client';

import React from 'react';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiX } from 'react-icons/si';
import YoutubeConnectButton from './YoutubeConnectButton';

interface Organization {
  slug: string;
  _id: string;
}

const AddDestination = ({ organization }: { organization: Organization }) => {
  const state = encodeURIComponent(
    JSON.stringify({
      redirectUrl: `/studio/${organization.slug}/destinations`,
      organizationId: organization._id,
    })
  );

  return (
    <Card className="w-full rounded-xl border bg-white shadow-none mb-8">
      <CardHeader>
        <CardTitle>Add a Destination</CardTitle>
        <CardDescription className="mt-2">
          Connect an account to StreamEth. Once connected, you can stream and
          upload clips and videos to it as often as you like.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mt-4 w-fit">
          <YoutubeConnectButton state={state} />
          <Button disabled className="min-w-[200px] bg-[#121212]">
            <SiX className="mr-2" />X account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddDestination;
