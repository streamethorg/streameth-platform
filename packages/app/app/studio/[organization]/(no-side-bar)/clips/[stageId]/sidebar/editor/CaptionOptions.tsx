import { useClipPageContext } from '../../ClipPageContext';
import { useState, useRef, useReducer, useEffect } from 'react';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ICaptionOptions } from 'streameth-reel-creator/types/constants';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import ColorPicker from '@/components/misc/form/colorPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

// Define action types
type CaptionOptionsAction =
  | { type: 'SET_ENABLED'; payload: boolean }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_POSITION'; payload: string }
  | { type: 'SET_FONT'; payload: string }
  | { type: 'SET_SIZE'; payload: number }
  | { type: 'SET_BASE_COLOR'; payload: string };

// Initial state
const initialCaptionOptions: ICaptionOptions = {
  enabled: false,
  position: 'top',
  font: 'Arial',
  color: '#6C757D',
  baseColor: '#000000',
  size: 24,
};

// Reducer function
const captionOptionsReducer = (
  state: ICaptionOptions,
  action: CaptionOptionsAction
): ICaptionOptions => {
  switch (action.type) {
    case 'SET_ENABLED':
      return { ...state, enabled: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_BASE_COLOR':
      return { ...state, baseColor: action.payload };
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload as 'top' | 'middle' | 'bottom',
      };
    case 'SET_FONT':
      return { ...state, font: action.payload };
    case 'SET_SIZE':
      return { ...state, size: action.payload };
    default:
      return state;
  }
};

const CaptionOptions = () => {
  const { setCaptionsOptions } = useClipPageContext();

  // Replace multiple useState calls with useReducer
  const [captionOptions, dispatch] = useReducer(
    captionOptionsReducer,
    initialCaptionOptions
  );

  // Update the parent context whenever our local state changes
  useEffect(() => {
    setCaptionsOptions(captionOptions);
  }, [captionOptions, setCaptionsOptions]);

  const handlePositionSelect = (position: string) => {
    dispatch({ type: 'SET_POSITION', payload: position });
  };


  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Verdana', 'Georgia'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Captions</Label>
        <Switch
          checked={captionOptions.enabled}
          onCheckedChange={(checked) =>
            dispatch({ type: 'SET_ENABLED', payload: checked })
          }
        />
      </div>

      <div className="flex flex-row border border-gray-200 rounded-xl divide-x divide-gray-200">
        {/* Caption Color */}
        <div className="px-3 py-2">
          <ColorPicker
            className="w-6 h-6"
            color={captionOptions.color}
            onChange={(color) =>
              dispatch({ type: 'SET_COLOR', payload: color })
            }
          />
        </div>

        {/* Base Color */}
        <div className="px-3 py-2">
          <ColorPicker
            className="w-6 h-6"
            color={captionOptions.baseColor || '#000000'}
            onChange={(color) =>
              dispatch({ type: 'SET_BASE_COLOR', payload: color })
            }
          />
        </div>

        {/* Caption Position */}
        <div className="border-gray-200">
          <Select
            value={captionOptions.position}
            onValueChange={(value) => handlePositionSelect(value)}
          >
            <SelectTrigger className="border-none w-24 space-x-2 bg-white rounded-none">
              <SelectValue placeholder="Select position" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Selection */}
        <div className="border-gray-200">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className=" w-28 justify-between border-none rounded-none"
              >
                <span className="truncate">
                  {captionOptions.font || 'Select font...'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search font..." />
                <CommandEmpty>No font found.</CommandEmpty>
                <CommandGroup>
                  {fonts.map((font) => (
                    <CommandItem
                      key={font}
                      value={font}
                      onSelect={() => {
                        dispatch({ type: 'SET_FONT', payload: font });
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          captionOptions.font === font
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {font}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Font Size */}
        <div className="flex items-center">
          <Input
            type="number"
            min="8"
            max="72"
            value={captionOptions.size.toString()}
            className="border-none bg-transparent px-2"
            onChange={(e) => {
              const size = parseInt(e.target.value, 10);
              if (!isNaN(size) && size > 0) {
                dispatch({ type: 'SET_SIZE', payload: size });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptionOptions;
