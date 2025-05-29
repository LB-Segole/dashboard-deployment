import React from 'react';

export interface FormFieldProps {
  name: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}

export function FormField({ name, children, className = '', error }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="space-y-1">
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
} 