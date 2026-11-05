import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#C2410C]/10 text-[#C2410C] border border-[#C2410C]/20',
        success: 'bg-[#2F6B3F]/10 text-[#2F6B3F] border border-[#2F6B3F]/20',
        warning: 'bg-[#E9A23B]/10 text-[#B45309] border border-[#E9A23B]/30',
        outline: 'border border-[#E7DFD1] text-[#2B2118]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
