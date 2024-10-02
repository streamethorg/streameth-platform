'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { IExtendedSession } from '@/lib/types';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Clip from './Clip';

const SessionSidebar = ({ sessions }: { sessions: IExtendedSession[] }) => {
  return (
    <div className="h-full w-full border-l flex flex-col">
      {/* Any header content */}
      <div className="flex-shrink-0">{/* ... */}</div>

      {/* Scrollable content */}
      <div className="flex-grow overflow-y-auto">
        {sessions.map((session) => (
          <div key={session._id} className="w-full px-4 py-2">
            {/* Render session item */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionSidebar;
