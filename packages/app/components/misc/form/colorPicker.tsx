'use client';
import { SketchPicker } from 'react-color';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ColorPicker = ({
  color,
  onChange,
}: {
  color: string | undefined;
  onChange: (color: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Popover>
      <PopoverTrigger>
        <Input
          style={{
            backgroundColor: color,
          }}
          type="text"
          value={color}
          readOnly
          onFocus={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent className="border-none bg-transparent shadow-none">
          <SketchPicker
            color={color}
            onChange={(color) => {
              onChange(color.hex);
            }}
          />
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ColorPicker;
