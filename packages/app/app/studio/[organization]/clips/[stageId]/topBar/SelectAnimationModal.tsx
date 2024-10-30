'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IExtendedSession } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Dropzone from '../../../library/components/upload/Dropzone'; // Import Dropzone for uploading new animations
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { Uploads } from '../../../library/components/UploadVideoDialog';

const SelectAnimationModal = ({
  animations,
  onChange,
}: {
  animations: IExtendedSession[];
  onChange: (value: string) => void;
}) => {
  return (
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <p>Select</p>
    //   </DialogTrigger>
    //   <DialogContent>
    //     <DialogTitle>Select Animation</DialogTitle>
    <Select onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="rounded-lg border bg-white">
        <SelectValue placeholder="select animation"></SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
        {animations.map((animation) => (
          <SelectItem key={animation._id} value={animation._id}>
            {animation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    //     <DialogFooter>
    //       <Button>Cancel</Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
};

export default SelectAnimationModal;
