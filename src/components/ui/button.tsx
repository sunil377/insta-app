import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium rounded-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary px-3 py-1.5 rounded',
                secondary:
                    'bg-muted text-foreground hover:bg-muted/50 focus-visible:ring-muted px-3 py-1.5 rounded',
                ghost: 'hover:bg-muted',
                link: 'text-primary underline-offset-4 hover:underline font-normal',
                text: 'text-primary hover:text-primary-dark',
                icon: 'hover:text-foreground/50 h-6 w-6 rounded-full text-2xl',
            },
        },
        defaultVariants: {
            variant: 'ghost',
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
