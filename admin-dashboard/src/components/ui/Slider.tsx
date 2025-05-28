import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  min?: number
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-700">
              {label}
            </label>
            <span className="text-sm text-slate-500">
              {props.value || 0}%
            </span>
          </div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer",
            "accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }