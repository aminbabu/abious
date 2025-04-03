import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const headingVariants = cva('relative font-medium', {
  variants: {
    variant: {
      default: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
      destructive: 'text-destructive',
    },
    size: {
      default: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl',
      sm: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl',
      lg: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Heading({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> &
  VariantProps<typeof headingVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'h2';

  return (
    <Comp
      data-slot="heading"
      className={cn(headingVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Heading, headingVariants };
