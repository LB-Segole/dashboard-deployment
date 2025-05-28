import React from 'react';

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 