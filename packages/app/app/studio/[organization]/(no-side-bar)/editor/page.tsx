import React from 'react';
import VideoEditorSidebar from './EditorSidebar';
import PlayerComponent from './player';
import Timeline from './timeline';
import { TimelineProvider } from './context/TimelineContext';
import { EditorProvider } from './context/EditorContext';

export default function VideoEditorLayout() {

  return (
    <EditorProvider>
        <TimelineProvider>
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
      </TimelineProvider>
    </EditorProvider> 

  );
}