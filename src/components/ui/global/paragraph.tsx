import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const paragraphVariants = cva('font-normal', {
  variants: {
    variant: {
      default: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
      destructive: 'text-destructive',
    },
    size: {
      default: 'text-base',
      xs: 'text-xs',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Paragraph({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'p'> &
  VariantProps<typeof paragraphVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      data-slot="p"
      className={cn(paragraphVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Paragraph, paragraphVariants };
