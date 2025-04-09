"use client"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDown, MapPin } from "lucide-react"
import type React from "react"
import { forwardRef, useCallback, useEffect, useState } from "react"

export interface Region {
  id: number
  regionCode: string
  regionNameEn: string
  regionNameMm: string
}

export interface Township {
  id: number
  regionCode: string
  districtCode: string
  townshipCode: string
  townshipNameEn: string
  townshipNameMm: string
}

interface BaseDropdownProps {
  disabled?: boolean
  placeholder?: string
}

interface RegionDropdownProps extends BaseDropdownProps {
  options: Region[]
  onChange?: (region: Region) => void
  defaultValue?: string
  /**
   * Whether to allow clearing the selected value
   */
  clearable?: boolean
}

interface TownshipDropdownProps extends BaseDropdownProps {
  options: Township[]
  onChange?: (township: Township) => void
  defaultValue?: string
  clearable?: boolean
}

const DropdownUI = ({
  open,
  onOpenChange,
  selected,
  displayName,
  disabled,
  placeholder,
  children,
  triggerRef,
  ...props
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selected?: { id: number }
  displayName: string
  disabled?: boolean
  placeholder?: string
  children: React.ReactNode
  triggerRef: React.ForwardedRef<HTMLButtonElement>
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger
      ref={triggerRef}
      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      disabled={disabled}
      {...props}
    >
      {selected ? (
        <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
          <MapPin size={20} className="shrink-0" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {displayName}
          </span>
        </div>
      ) : (
        <span>{placeholder}</span>
      )}
      <ChevronDown size={16} />
    </PopoverTrigger>
    <PopoverContent
      collisionPadding={10}
      side="bottom"
      className="min-w-[--radix-popper-anchor-width] p-0"
    >
      <Command className="w-full max-h-[200px] sm:max-h-[270px]">
        <CommandList>
          <div className="sticky top-0 z-10 bg-popover">
            <CommandInput
              placeholder={`Search ${placeholder?.toLowerCase()}...`}
            />
          </div>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
)

// Region Dropdown Component
const RegionDropdownComponent = (
  {
    options,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select region",
    clearable,
    ...props
  }: RegionDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Region | undefined>()

  const handleSelect = useCallback(
    (region: Region) => {
      if (selected?.id === region.id && clearable) {
        setSelected(undefined)
        //@ts-expect-error
        onChange?.(null)
        setOpen(false)
        return
      }
      setSelected(region)
      onChange?.(region)
      setOpen(false)
    },
    [onChange, selected, clearable]
  )

  useEffect(() => {
    if (defaultValue) {
      const initial = options.find(
        (region) => region.regionCode === defaultValue
      )
      setSelected(initial)
    } else {
      setSelected(undefined)
    }
  }, [defaultValue, options])

  return (
    <DropdownUI
      open={open}
      onOpenChange={setOpen}
      selected={selected}
      displayName={selected?.regionNameEn || ""}
      disabled={disabled}
      placeholder={placeholder}
      triggerRef={ref}
      {...props}
    >
      {options.map((region) => (
        <CommandItem
          key={region.id}
          className="flex items-center w-full gap-2"
          onSelect={() => handleSelect(region)}
        >
          {region.regionNameEn}
          <CheckIcon
            className={cn(
              "ml-auto h-4 w-4 shrink-0",
              region === selected ? "opacity-100" : "opacity-0"
            )}
          />
        </CommandItem>
      ))}
    </DropdownUI>
  )
}

// Township Dropdown Component
const TownshipDropdownComponent = (
  {
    options,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select township",
    clearable,
    ...props
  }: TownshipDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Township | undefined>()

  useEffect(() => {
    if (defaultValue) {
      const initial = options.find(
        (township) => township.townshipCode === defaultValue
      )
      setSelected(initial)
    } else {
      setSelected(undefined)
    }
  }, [defaultValue, options])

  const handleSelect = useCallback(
    (township: Township) => {
      if (selected?.id === township.id && clearable) {
        setSelected(undefined)
        //@ts-expect-error
        onChange?.(null)
        setOpen(false)
        return
      }
      setSelected(township)
      onChange?.(township)
      setOpen(false)
    },
    [onChange, selected, clearable]
  )

  return (
    <DropdownUI
      open={open}
      onOpenChange={setOpen}
      selected={selected}
      displayName={selected?.townshipNameEn || ""}
      disabled={disabled}
      placeholder={placeholder}
      triggerRef={ref}
      {...props}
    >
      {options.map((township) => (
        <CommandItem
          key={township.id}
          className="flex items-center w-full gap-2"
          onSelect={() => handleSelect(township)}
        >
          {township.townshipNameEn}
          <CheckIcon
            className={cn(
              "ml-auto h-4 w-4 shrink-0",
              township === selected ? "opacity-100" : "opacity-0"
            )}
          />
        </CommandItem>
      ))}
    </DropdownUI>
  )
}

RegionDropdownComponent.displayName = "RegionDropdownComponent"
TownshipDropdownComponent.displayName = "TownshipDropdownComponent"

export const RegionDropdown = forwardRef(RegionDropdownComponent)
export const TownshipDropdown = forwardRef(TownshipDropdownComponent)
