'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/utils'

type LabelProps = {
  required?: boolean
}

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    LabelProps &
    VariantProps<typeof labelVariants>
>(({ className, required, ...props }, ref) => (
  <div>
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
    {required && <span className="text-red-500"> *</span>}
  </div>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
