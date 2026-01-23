'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Array of options to display */
  options: ComboboxOption[];
  /** Current selected value */
  value?: string | null;
  /** Callback when value changes */
  onValueChange?: (value: string | null) => void;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Text to show when no options are found */
  emptyText?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Width of the trigger button */
  width?: string;
  /** Class name for the popover content */
  popoverClassName?: string;
  /** Alignment of the popover */
  align?: 'start' | 'center' | 'end';
  /** Whether to show the chevron icon */
  showChevron?: boolean;
  /** Custom trigger content (overrides default button) */
  trigger?: React.ReactNode;
  /** Whether the trigger should match the selected option styling */
  matchTriggerWidth?: boolean;
  /** Custom render function for items - returns the complete CommandItem */
  renderItem?: (props: ItemProps) => React.ReactNode;
}

export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  emptyText = 'No option found.',
  disabled = false,
  className,
  width,
  popoverClassName = '',
  align = 'start',
  showChevron = true,
  trigger,
  matchTriggerWidth = true,

  renderItem,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? null : selectedValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  const triggerContent = trigger || (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={disabled}
      className={cn(
        'justify-between',
        matchTriggerWidth ? width : '',
        !selectedOption && 'text-muted-foreground',
        className
      )}
    >
      <span className="truncate">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      {showChevron && (
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      )}
    </Button>
  );

  const Item = renderItem || DefaultRenderItem;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {triggerContent}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0',
          matchTriggerWidth && '!w-[var(--radix-popover-trigger-width)]',
          !matchTriggerWidth && popoverClassName
        )}
        align={align}
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList className="scrollbar-none max-h-32">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <Item
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  option={option}
                  isSelected={value === option.value}
                  disabled={!!option.disabled}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;

type ItemProps = {
  option: ComboboxOption;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (value: string) => void;
  className?: string;
} & React.ComponentProps<typeof CommandItem>;

const DefaultRenderItem = ({
  option,
  isSelected,
  disabled,
  onSelect,
  className,
  ...props
}: ItemProps) => {
  return (
    <CommandItem
      key={option.value}
      value={option.value}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        option.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      <span className="truncate">{option.label}</span>
      <Check
        className={cn(
          'ml-auto h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  );
};
