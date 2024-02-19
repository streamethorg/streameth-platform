import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Item {
  label: string
  value: string
}

export default function Combobox({
  items = [],
  value,
  setValue,
  valueKey = 'value',
  labelKey = 'label',
}: {
  items?: Item[]
  value: string
  valueKey?: string
  labelKey?: string
  setValue: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {value ? value : 'Select item...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] h-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={
                  valueKey ? item[valueKey as keyof Item] : item.value
                }
                value={
                  valueKey ? item[valueKey as keyof Item] : item.value
                }
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === item.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {labelKey ? item[labelKey as keyof Item] : item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
