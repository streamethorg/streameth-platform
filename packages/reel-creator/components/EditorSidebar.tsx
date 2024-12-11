"use client";
import React, { useState } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { cn } from "@/lib/utils";
import LayoutSettings from './sidebar-components/LayoutSettings';
import CaptionSettings from './sidebar-components/CaptionSettings';
import AnimationSettings from './sidebar-components/AnimationSettings';
import BrandingSettings from './sidebar-components/BrandingSettings';
import { RenderControls } from './RenderControls';
import { useTimeline } from '@/context/TimelineContext';
type SettingTab = 'layout' | 'captions' | 'animations' | 'branding';

export default function EditorSidebar() {
  const [activeTab, setActiveTab] = useState<SettingTab>('layout');
  const {
    selectedAspectRatio,
    captionEnabled,
    captionLinesPerPage,
    captionPosition,
    captionFont, // Add this
    captionColor, // Add this
    videoUrl,
    fps,
  } = useEditorContext();

  const {
    events,
  } = useTimeline()


  const inputProps = { 
    videoUrl, 
    transcription: undefined, 
    frameRate: fps, 
    events, 
    selectedAspectRatio,
    captionEnabled,
    captionPosition,
    captionLinesPerPage,
    captionFont,
    captionColor
  };

  const NavItem: React.FC<{ tab: SettingTab; label: string }> = ({ tab, label }) => (
    <button
      className={cn(
        "w-full text-left px-4 py-2 text-sm font-medium transition-colors",
        activeTab === tab
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-background border-r">
      <nav className="w-28 bg-muted h-full">
        <div className="space-y-1 py-4">
          <NavItem tab="layout" label="Layout" />
          <NavItem tab="captions" label="Captions" />
          <NavItem tab="animations" label="Animations" />
          <NavItem tab="branding" label="Branding" />
        </div>
        <div className='mt-auto'>
          <RenderControls inputProps={inputProps} />
        </div>
      </nav>
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'layout' && <LayoutSettings />}
        {activeTab === 'captions' && <CaptionSettings />}
        {activeTab === 'animations' && <AnimationSettings />}
        {activeTab === 'branding' && <BrandingSettings />}
      </div>
    </div>
  );
}