'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { IExtendedSession } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils/utils';

const TranscriptionModal = ({ video }: { video: IExtendedSession }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>View Transcript</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[800px] max-h-[400px] lg:max-h-[600px] overflow-auto">
        <DialogTitle>Transcript for {video?.name}</DialogTitle>
        <div className="space-y-4">
          {video?.transcripts?.chunks.map((chunk, index) => (
            <div key={index}>
              <p>[{formatTimestamp(chunk.timestamp[0])}]</p>
              <p>{chunk.text}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptionModal;
