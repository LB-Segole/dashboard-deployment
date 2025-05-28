import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('rounded-2xl shadow-lg transition-shadow', {
  variants: {
    variant: {
      default: 'bg-white hover:shadow-xl',
      primary: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export const Card = ({ variant, className, children, ...props }: CardProps) => {
  return (
    <div className={cardVariants({ variant, className })} {...props}>
      {children}
    </div>
  );
};