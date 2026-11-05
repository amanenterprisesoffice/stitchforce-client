"use client"

import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react"
import { State2 } from "../StateComponent"
import { cn } from "cn"

// Types

interface MultiSelectContextType {
  open: boolean
  setOpen: (open: boolean) => void
  selectedValues: Set<string>
  toggleValue: (value: string) => void
  items: Map<string, ReactNode>
  onItemAdded: (value: string, label: ReactNode) => void
}

interface MultiSelectProps
  extends Omit<React.ComponentProps<typeof Popover>, "open" | "onOpenChange"> {
  children: ReactNode
  values?: string[]
  defaultValues?: string[]
  onValuesChange?: (values: string[]) => void
  [key: string]: any
}

interface MultiSelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?:
    "outline" | "ghost" | "link" | "destructive" | "secondary" | "default"
}

interface MultiSelectValueProps extends HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  clickToRemove?: boolean
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff"
}

interface MultiSelectContentProps {
  children: ReactNode
  search?: boolean | { placeholder?: string }
  emptyMessage?: ReactNode | false
  [key: string]: unknown
}

interface MultiSelectItemProps
  extends Omit<React.ComponentProps<typeof CommandItem>, "onSelect"> {
  value: string
  badgeLabel?: ReactNode
  onSelect?: (value: string) => void
}
const MultiSelectContext = createContext<MultiSelectContextType | null>(null)

// Root

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const [internalValues, setInternalValues] = useState(
    () => new Set<string>(defaultValues ?? [])
  )

  const selectedValues = values !== undefined
    ? new Set(values)
    : internalValues

  const [items, setItems] = useState(() => new Map<string, ReactNode>())

  const toggleValue = useCallback(
    (value: string) => {
      const getNewSet = (prev: Set<string>) => {
        const newSet = new Set(prev)

        if (newSet.has(value)) {
          newSet.delete(value)
        } else {
          newSet.add(value)
        }

        return newSet
      }

      if (values !== undefined) {
        const newSet = getNewSet(new Set(values))
        onValuesChange?.([...newSet])
      } else {
        setInternalValues((prev) => {
          const newSet = getNewSet(prev)
          onValuesChange?.([...newSet])
          return newSet
        })
      }
    },
    [values, onValuesChange]
  )

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev
      return new Map(prev).set(value, label)
    })
  }, [])

  return (
    <MultiSelectContext.Provider
      value={{
        open,
        setOpen,
        selectedValues,
        toggleValue,
        items,
        onItemAdded,
      }}
    >
      <Popover
        {...props}
        open={open}
        onOpenChange={setOpen}
      >
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  )
}

// Trigger

export function MultiSelectTrigger({
  className,
  children,
  variant,
  ...props
}: MultiSelectTriggerProps) {
  const { open } = useMultiSelectContext()

  return (
    <PopoverTrigger
      render={
        <Button
          {...props}
          variant={variant ?? "outline"}
          role={props.role ?? "combobox"}
          aria-expanded={props["aria-expanded"] ?? open}
          className={cn(
            "dark:border-gray-deep dark:bg-gray-dark flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-xs whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:text-white dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
            className
          )}
        >
          {children}

          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      }
    />
  )
}

// Selected values

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: MultiSelectValueProps) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext()

  const [overflowAmount, setOverflowAmount] = useState(0)

  const valueRef = useRef<HTMLDivElement | null>(null)
  const overflowRef = useRef<HTMLDivElement | null>(null)

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open)

  const checkOverflow = useCallback(() => {
    if (!valueRef.current) return

    const containerElement = valueRef.current
    const overflowElement = overflowRef.current

    const selectedItems = containerElement.querySelectorAll<HTMLElement>(
      "[data-selected-item]"
    )

    if (overflowElement) {
      overflowElement.style.display = "none"
    }

    selectedItems.forEach((child) => {
      child.style.removeProperty("display")
    })

    let amount = 0

    for (let i = selectedItems.length - 1; i >= 0; i--) {
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break
      }

      amount = selectedItems.length - i

      selectedItems[i].style.display = "none"

      if (overflowElement) {
        overflowElement.style.removeProperty("display")
      }
    }

    setOverflowAmount(amount)
  }, [])

  useLayoutEffect(() => {
    checkOverflow()
  }, [selectedValues, checkOverflow, shouldWrap])

  const handleResize = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return

      valueRef.current = node

      const observer = new ResizeObserver(checkOverflow)

      observer.observe(node)

      return () => {
        observer.disconnect()
        valueRef.current = null
      }
    },
    [checkOverflow]
  )

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="min-w-0 overflow-hidden font-normal">{placeholder}</span>
    )
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        className
      )}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant="outline"
            data-selected-item
            className="group bg-blue-light text-blue-sexy flex items-center rounded-[3px] border border-transparent px-2 py-[1px]"
            key={value}
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation()
                    toggleValue(value)
                  }
                : undefined
            }
          >
            {items.get(value)}

            {clickToRemove && (
              <XIcon className="size-2 text-black group-hover:text-destructive" />
            )}
          </Badge>
        ))}

      <Badge
        style={
          {
            display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
          } as CSSProperties
        }
        variant="secondary"
        ref={overflowRef}
      >
        +{overflowAmount}
      </Badge>
    </div>
  )
}

// Dropdown content

export function MultiSelectContent({
  search = true,
  emptyMessage = false,
  children,
  ...props
}: MultiSelectContentProps) {
  const canSearch = typeof search === "object" ? true : search

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>

      <PopoverContent className="pointer-events-auto min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              }
            />
          ) : (
            <button autoFocus className="sr-only" />
          )}

          <CommandList>
            {emptyMessage && (
              <State2 color="yellow" isEmpty>
                {emptyMessage}
              </State2>
            )}

            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  )
}

// Dropdown item

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: MultiSelectItemProps) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()

  const isSelected = selectedValues.has(value)

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children)
  }, [value, children, onItemAdded, badgeLabel])

  return (
    <CommandItem
      {...props}
      value={value}
      className="cursor-pointer select-none"
      onSelect={(v) => {
        toggleValue(v)
        onSelect?.(v)
      }}
    >
      <CheckIcon
        className={cn(
          "mr-2 size-4 text-inherit",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />

      {children}
    </CommandItem>
  )
}

// Group

export function MultiSelectGroup(
  props: React.ComponentProps<typeof CommandGroup>
) {
  return <CommandGroup {...props} />
}

// Separator

export function MultiSelectSeparator(
  props: React.ComponentProps<typeof CommandSeparator>
) {
  return <CommandSeparator {...props} />
}

// Context hook

function useMultiSelectContext(): MultiSelectContextType {
  const context = useContext(MultiSelectContext)

  if (context === null) {
    throw new Error("useMultiSelectContext must be used within a MultiSelect")
  }

  return context
}
