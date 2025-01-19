import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
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
import Image from 'next/image';

interface Item {
  label: string;
  value: string;
  logo?: string;
}

const renderLogo = (logo?: string) => (
  <Image
    className="mr-1"
    src={logo ?? '/logo.png'}
    alt="logo"
    width={20}
    height={20}
  />
);

export default function Combobox({
  placeholder = 'Select item',
  items = [],
  value,
  setValue,
  logo,
  variant = 'outline',
  disabled = false,
}: {
  placeholder?: string;
  items?: Item[];
  value: string;
  valueKey?: string;
  labelKey?: string;
  logo?: boolean;
  variant?: 'outline' | 'primary' | 'ghost';
  disabled?: boolean;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const orgLogo = items.find((item) => item.value === value)?.logo;

  const selectedLabel = items?.find((item) => item?.value === value)?.label;

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className=""
          variant={'outline'}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
        >
          {logo && renderLogo(orgLogo)}
          <p className="truncate ...">
            {selectedLabel ? selectedLabel : placeholder}
          </p>
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
                className="max-w-[300px]"
                key={item.value}
                value={item.label}
                onSelect={() => {
                  setValue(item.value);
                  setOpen(false);
                }}
              >
                <div>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
