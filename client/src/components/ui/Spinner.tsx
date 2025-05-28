import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    color: {
      default: 'text-blue-600',
      white: 'text-white',
      gray: 'text-gray-600',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = ({ size, color, className }: SpinnerProps) => {
  return (
    <Loader2 className={spinnerVariants({ size, color, className })} />
  );
};