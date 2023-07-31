import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const labelVariants = cva(
    'inline-flex items-center justify-center text-sm font-medium transition-colors',
    {
        variants: {
            variant: {
                file: 'bg-primary text-primary-foreground px-3 py-2 rounded-md focus-within:ring-primary hover:bg-primary-dark cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 ring-offset-background',
            },
        },
        defaultVariants: {
            variant: 'file',
        },
    },
)

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
        VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ variant }), className)}
        {...props}
    />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
