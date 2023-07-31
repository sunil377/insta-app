import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import React, { forwardRef } from 'react'

const List = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                className={cn('divide-y text-center', className)}
                ref={ref}
                {...props}
            />
        )
    },
)

List.displayName = 'List'

/* ListItem */

interface IListItem extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
}

const ListItem = forwardRef<HTMLButtonElement, IListItem>(
    ({ className, asChild = false, ...props }, ref) => {
        const Com = asChild ? Slot : 'button'

        return (
            <Com
                className={cn(
                    'block w-full py-3.5 first:rounded-t-md last:rounded-b-md',
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)

ListItem.displayName = 'ListItem'

export { List, ListItem }
