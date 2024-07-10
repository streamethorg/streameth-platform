'use client'
import React, { useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IExtendedStage } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useSearchParams from '@/lib/hooks/useSearchParams'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface'
import { Checkbox } from '@/components/ui/checkbox'

const LibraryFilter = ({ stages }: { stages: IExtendedStage[] }) => {
  const { searchParams, handleTermChange } = useSearchParams()
  const [selectedStage, setSelectedStage] = useState(
    searchParams.get('stage') || undefined
  )
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') || undefined
  )
  const [selectedVisibility, setSelectedVisibility] = useState(
    searchParams.get('published') || undefined
  )
  const [openPopover, setOpenPopover] = useState(false)

  const count = [
    selectedStage,
    selectedType,
    selectedVisibility,
  ].reduce((count, item) => count + (item !== undefined ? 1 : 0), 0)
  const handleClearFilter = () => {
    setSelectedStage(undefined)
    setSelectedType(undefined)
    setSelectedVisibility(undefined)
  }
  const handleSaveFilter = () => {
    handleTermChange([
      {
        key: 'stage',
        value: selectedStage,
      },
      {
        key: 'type',
        value: selectedType,
      },
      {
        key: 'published',
        value: selectedVisibility,
      },
      {
        key: 'page',
        value: '1',
      },
    ])
    setOpenPopover(false)
  }

  const sessionTypes = Object.keys(SessionType).map((key) => ({
    label: key,
    value: (SessionType as any)[key],
  }))

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FaFilter />
          Filter <span>{count > 0 && `| ${count}`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 p-0">
        <div className="flex items-center justify-between gap-2 border-b border-secondary p-2">
          <Button
            onClick={handleClearFilter}
            size="sm"
            variant="outline">
            Clear
          </Button>
          <h4 className="text-center font-bold">Filters</h4>
          <Button
            onClick={handleSaveFilter}
            size="sm"
            variant="primary">
            Save
          </Button>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="stage">
            <AccordionTrigger className="px-2 py-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={!!selectedStage}
                  onCheckedChange={() => setSelectedStage(undefined)}
                />
                <h4 className="text-sm font-medium">Stage</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <Select
                value={selectedStage}
                onValueChange={(value) => setSelectedStage(value)}>
                <SelectTrigger>
                  <SelectValue
                    defaultValue={selectedStage}
                    placeholder={'Select a stage'}
                  />
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="type">
            <AccordionTrigger className="px-2 py-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={!!selectedType}
                  onCheckedChange={() => setSelectedType(undefined)}
                />
                <h4 className="text-sm font-medium">Video type</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue
                    defaultValue={selectedType}
                    placeholder={'Select video type'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="visibility">
            <AccordionTrigger className="px-2 py-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={!!selectedVisibility}
                  onCheckedChange={() =>
                    setSelectedVisibility(undefined)
                  }
                />
                <h4 className="text-sm font-medium">Visibility</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <Select
                value={selectedVisibility}
                onValueChange={(value) =>
                  setSelectedVisibility(value)
                }>
                <SelectTrigger>
                  <SelectValue
                    defaultValue={selectedVisibility}
                    placeholder={'Select visibility'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="false">private</SelectItem>
                    <SelectItem value="true">public</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  )
}

export default LibraryFilter
