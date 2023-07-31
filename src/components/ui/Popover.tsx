import { cn } from '@/lib/utils'
import { Popover } from '@headlessui/react'
import { motion } from 'framer-motion'
import React, { forwardRef } from 'react'

const PopoverTrigger = Popover.Button

const PopoverComponent = motion(Popover.Panel)

const PopoverPanel = forwardRef<
    React.ElementRef<typeof Popover.Panel>,
    React.ComponentPropsWithoutRef<typeof Popover.Panel> &
        React.ComponentPropsWithoutRef<typeof PopoverComponent>
>(({ className, ...props }, ref) => (
    <PopoverComponent
        ref={ref}
        className={cn('fixed z-30 bg-background text-foreground', className)}
        {...props}
    />
))

PopoverPanel.displayName = Popover.Panel.displayName

export { Popover } from '@headlessui/react'
export { PopoverPanel, PopoverTrigger }
