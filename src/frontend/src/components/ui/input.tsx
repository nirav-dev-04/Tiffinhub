import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#E7DFD1] bg-white px-3.5 py-2 text-sm text-[#2B2118] transition-colors',
          'placeholder:text-[#2B2118]/40 focus:border-[#C2410C] focus:outline-none focus:ring-1 focus:ring-[#C2410C]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
