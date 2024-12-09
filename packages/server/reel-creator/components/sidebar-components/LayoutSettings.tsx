import React from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LayoutSettings() {
  const { selectedAspectRatio, aspectRatios, setSelectedAspectRatio } = useEditorContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Layout Settings</h2>
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <RadioGroup value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
          {aspectRatios.map((ratio) => (
            <div key={ratio} className="flex items-center space-x-2">
              <RadioGroupItem value={ratio} id={`aspect-ratio-${ratio}`} />
              <Label htmlFor={`aspect-ratio-${ratio}`}>{ratio}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {/* Add more layout settings here */}
    </div>
  );
}