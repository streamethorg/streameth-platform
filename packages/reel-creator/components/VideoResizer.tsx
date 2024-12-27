import React from 'react';
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface VideoResizerProps {
  eventIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  onPositionChange: (index: number, x: number, y: number, width: number, height: number) => void;
}

const VideoResizer: React.FC<VideoResizerProps> = ({ eventIndex, x, y, width, height, onPositionChange }) => {
  const handleChange = (property: 'x' | 'y' | 'width' | 'height', value: number) => {
    const newValues = { x, y, width, height, [property]: value };
    onPositionChange(eventIndex, newValues.x, newValues.y, newValues.width, newValues.height);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="x-position">X Position: {x}%</Label>
        <Slider
          id="x-position"
          min={0}
          max={100}
          step={1}
          value={[x]}
          onValueChange={(value) => handleChange('x', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="y-position">Y Position: {y}%</Label>
        <Slider
          id="y-position"
          min={0}
          max={100}
          step={1}
          value={[y]}
          onValueChange={(value) => handleChange('y', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="width">Width: {width}%</Label>
        <Slider
          id="width"
          min={0}
          max={100}
          step={1}
          value={[width]}
          onValueChange={(value) => handleChange('width', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="height">Height: {height}%</Label>
        <Slider
          id="height"
          min={0}
          max={100}
          step={1}
          value={[height]}
          onValueChange={(value) => handleChange('height', value[0])}
        />
      </div>
    </div>
  );
};

export default VideoResizer;