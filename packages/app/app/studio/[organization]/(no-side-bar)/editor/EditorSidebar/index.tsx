'use client';
import React from 'react';
import LayoutSettings from './LayoutSettings';
import CaptionSettings from './CaptionSettings';
import AnimationSettings from './AnimationSettings';
import BrandingSettings from './BrandingSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EditorSidebar() {
  return (
    <Tabs
      defaultValue="layout"
      className="flex flex-col h-full bg-white w-full"
    >
      <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="captions">Captions</TabsTrigger>
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto p-4">
        <TabsContent value="layout">
          <LayoutSettings />
        </TabsContent>
        <TabsContent value="captions">
          <CaptionSettings />
        </TabsContent>
        <TabsContent value="import">
          <AnimationSettings />
        </TabsContent>
        <TabsContent value="branding">
          <BrandingSettings />
        </TabsContent>
      </div>
    </Tabs>
  );
}
