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
import Image from 'next/image'

interface Item {
  label: string
  value: string
  logo?: string
}

const renderLogo = (logo?: string) => (
  <Image
    className="mr-1"
    src={logo ?? '/logo.png'}
    alt="logo"
    width={20}
    height={20}
  />
)

export default function Combobox({
  placeholder = 'Select item',
  items = [],
  value,
  setValue,
  logo,
  variant = 'outline',
}: {
  placeholder?: string
  items?: Item[]
  value: string
  valueKey?: string
  labelKey?: string
  logo?: boolean
  variant?: 'outline' | 'primary' | 'ghost'
  setValue: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const orgLogo = items.find((item) => item.label === value)?.logo

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {logo && renderLogo(orgLogo)}
          {value ? value : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[400px] w-full p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue === item.label ? '' : item.value
                  )
                  setOpen(false)
                }}>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === item.label ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
