"use client"
import React, {useRef} from 'react';
import VideoEditorSidebar from '../components/EditorSidebar';
import PlayerComponent from '../components/Player';
import Timeline from '@/components/timeline';
import { PlayerRef } from '@remotion/player';

export default function VideoEditorLayout() {

  return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex flex-row h-[calc(100%-18rem)]">
          <div className='w-1/3 flex h-full'><VideoEditorSidebar /></div>
          <div className="w-2/3 flex h-full">
          <PlayerComponent  />
          </div>
        </div>
        <div className="h-72 bg-muted w-full">
          <Timeline />
        </div>
      </div>

  );
}