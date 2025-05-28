import React from 'react';
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onValueChange, options, className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className={cn(
              "flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm ring-offset-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }