import * as React from "react"
import { cn } from "@/lib/utils"

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

const Form: React.FC<FormProps> = ({ className, children, ...props }) => {
  return (
    <form
      className={cn("space-y-6", className)}
      {...props}
    >
      {children}
    </form>
  )
}

interface FormFieldProps {
  label?: string
  description?: string
  error?: string
  children: React.ReactNode
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export { Form, FormField }