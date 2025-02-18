import React from 'react';
import { useEditorContext } from '../context/EditorContext';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
export default function LayoutSettings() {
  const { selectedAspectRatio, aspectRatios, setSelectedAspectRatio } =
    useEditorContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Layout Settings</h2>
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select
          value={selectedAspectRatio}
          onValueChange={setSelectedAspectRatio}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            {aspectRatios.map((ratio) => (
              <SelectItem key={ratio} value={ratio}>
                {ratio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Add more layout settings here */}
    </div>
  );
}
