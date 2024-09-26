'use client';
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IExtendedStage } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { Check, Clapperboard, Eye, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LibraryFilter = ({ stages }: { stages: IExtendedStage[] }) => {
  const { searchParams, handleTermChange } = useSearchParams();
  const [selectedStage, setSelectedStage] = useState(
    searchParams?.get('stage') || ''
  );
  const [selectedType, setSelectedType] = useState(
    searchParams?.get('type') || ''
  );
  const [selectedVisibility, setSelectedVisibility] = useState(
    searchParams?.get('published') || ''
  );
  const [openPopover, setOpenPopover] = useState(false);

  const count = [selectedStage, selectedType, selectedVisibility].filter(
    Boolean
  ).length;

  const handleClearFilter = () => {
    setSelectedStage('');
    setSelectedType('');
    setSelectedVisibility('');
  };

  const handleSaveFilter = () => {
    handleTermChange([
      { key: 'stage', value: selectedStage },
      { key: 'type', value: selectedType },
      { key: 'published', value: selectedVisibility },
      { key: 'page', value: '1' },
    ]);
    setOpenPopover(false);
  };

  const sessionTypes = Object.keys(SessionType).map((key) => ({
    label: key,
    value: (SessionType as any)[key],
  }));

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FaFilter />
          Filter {count > 0 && <span>| {count}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold">Filters</h4>
          <Button onClick={handleClearFilter} size="sm" variant="outline">
            Clear Filters
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="stage"
              className="text-sm font-medium flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              Stage
              {selectedStage && <Check className="w-4 h-4 text-green-500" />}
            </label>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger id="stage">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {stages.map((stage) => (
                    <SelectItem key={stage._id} value={stage._id!}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="type"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Clapperboard className="w-5 h-5" />
              Video Type
              {selectedType && <Check className="w-4 h-4 text-green-500" />}
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select video type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label.charAt(0).toUpperCase() + type.label.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="visibility"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Visibility
              {selectedVisibility && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </label>
            <Select
              value={selectedVisibility}
              onValueChange={setSelectedVisibility}
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="false">Private</SelectItem>
                  <SelectItem value="true">Public</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSaveFilter} className="w-full" variant="primary">
          Apply Filters
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default LibraryFilter;
