import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className={cn(
              "sr-only peer",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors">
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
          </div>
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-700">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }