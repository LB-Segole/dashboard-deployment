import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"

interface DateRange {
  from?: Date
  to?: Date
}

interface DatePickerProps {
  label?: string
  error?: string
  mode?: "single" | "range"
  selected?: Date | DateRange
  onSelect?: (value: Date | DateRange) => void
  // All other input props
  [key: string]: any
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, mode = "single", selected, onSelect, ...props }, ref) => {
    const [range, setRange] = React.useState<DateRange>({
      from: mode === "range" && selected && typeof selected === "object" && !(selected instanceof Date) ? selected.from : undefined,
      to: mode === "range" && selected && typeof selected === "object" && !(selected instanceof Date) ? selected.to : undefined,
    })
    const [single, setSingle] = React.useState<Date | undefined>(
      mode === "single" && selected && selected instanceof Date ? selected : undefined
    )

    React.useEffect(() => {
      if (mode === "range" && selected && typeof selected === "object" && !(selected instanceof Date)) {
        setRange({ from: selected.from, to: selected.to })
      } else if (mode === "single" && selected instanceof Date) {
        setSingle(selected)
      }
    }, [selected, mode])

    const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value) : undefined
      setSingle(date)
      onSelect && onSelect(date as Date)
    }

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, which: "from" | "to") => {
      const date = e.target.value ? new Date(e.target.value) : undefined
      const newRange = { ...range, [which]: date }
      setRange(newRange)
      onSelect && onSelect(newRange)
    }

    return (
      <div className="grid gap-1">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex space-x-2">
          {mode === "range" ? (
            <>
              <input
                type="date"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500 focus:ring-red-500",
                  className
                )}
                ref={ref}
                value={range.from ? range.from.toISOString().slice(0, 10) : ""}
                onChange={e => handleRangeChange(e, "from")}
                {...props}
              />
              <span className="self-center">to</span>
              <input
                type="date"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500 focus:ring-red-500",
                  className
                )}
                value={range.to ? range.to.toISOString().slice(0, 10) : ""}
                onChange={e => handleRangeChange(e, "to")}
                {...props}
              />
              <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
            </>
          ) : (
            <>
              <input
                type="date"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500 focus:ring-red-500",
                  className
                )}
                ref={ref}
                value={single ? single.toISOString().slice(0, 10) : ""}
                onChange={handleSingleChange}
                {...props}
              />
              <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
            </>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }