import React from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTimeline } from '@/context/TimelineContext';

export default function CaptionSettings() {
  const {
    captionEnabled,
    captionLinesPerPage,
    captionPosition,
    captionFont,
    captionColor,
    setCaptionEnabled,
    setCaptionLinesPerPage,
    setCaptionPosition,
    setCaptionFont,
    setCaptionColor,
  } = useEditorContext();

  const {
    addEvent
  } = useTimeline()

  return (
    <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Label htmlFor="caption-enabled">Enable Captions</Label>
      <Switch
        id="caption-enabled"
        checked={captionEnabled}
        onCheckedChange={setCaptionEnabled}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="caption-lines">Lines per Page</Label>
      <Select value={captionLinesPerPage} onValueChange={setCaptionLinesPerPage}>
        <SelectTrigger id="caption-lines">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
          <SelectItem value="3">Three</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="caption-position">Position</Label>
      <Select value={captionPosition} onValueChange={setCaptionPosition}>
        <SelectTrigger id="caption-position">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top-5">Top</SelectItem>
          <SelectItem value="top-[1/2] bottom-[1/2]">Middle</SelectItem>
          <SelectItem value="bottom-10">Bottom</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="caption-font">Font</Label>
      <Input
        id="caption-font"
        value={captionFont}
        onChange={(e) => setCaptionFont(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="caption-color">Color</Label>
      <Input
        id="caption-color"
        type="color"
        value={captionColor}
        onChange={(e) => setCaptionColor(e.target.value)}
      />
    </div>
  </div>
  );
}