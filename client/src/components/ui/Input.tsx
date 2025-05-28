import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500',
  {
    variants: {
      size: {
        default: 'py-2 px-3 text-sm',
        sm: 'py-1 px-2 text-xs',
        lg: 'py-3 px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = ({
  size,
  className,
  error,
  startIcon,
  endIcon,
  ...props
}: InputProps) => {
  return (
    <div className="relative">
      {startIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        className={inputVariants({
          size,
          className: `${className} ${error ? 'border-red-300 text-red-900 placeholder-red-300' : ''} ${
            startIcon ? 'pl-10' : ''
          } ${endIcon ? 'pr-10' : ''}`,
        })}
        {...props}
      />
      {endIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {endIcon}
        </div>
      )}
    </div>
  );
};