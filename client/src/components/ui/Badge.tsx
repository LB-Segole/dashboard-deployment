import * as React from "react";
import { cn } from "../../utils/cn";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = "default", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";

  const variantClasses = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-600/80",
    outline: "border-slate-200 text-slate-900",
    success: "border-transparent bg-green-600 text-white hover:bg-green-600/80",
    warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-600/80"
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)} 
      {...props} 
    />
  );
};

export { Badge }; 