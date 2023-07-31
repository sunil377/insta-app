import { cn } from '@/lib/utils'
import { Menu } from '@headlessui/react'
import { VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { buttonVariants } from './button'

const MenuTrigger = Menu.Button

/* MenuItems */

const MenuItemsComponent = motion(Menu.Items)

const MenuItems = forwardRef<
    React.ElementRef<typeof Menu.Items>,
    React.ComponentPropsWithoutRef<typeof Menu.Items> &
        React.ComponentPropsWithoutRef<typeof MenuItemsComponent>
>(({ className, ...props }, ref) => (
    <MenuItemsComponent
        ref={ref}
        className={cn(
            'absolute w-56 divide-y rounded-md border bg-popover text-popover-foreground',
            className,
        )}
        {...props}
    />
))

MenuItems.displayName = Menu.Items.displayName

/* MenuItem */

const MenuItem = forwardRef<
    React.ElementRef<typeof Menu.Item>,
    React.ComponentPropsWithRef<typeof Menu.Item> &
        VariantProps<typeof buttonVariants>
>(({ variant, className, ...props }, ref) => {
    return (
        <Menu.Item
            ref={ref}
            className={cn(
                buttonVariants({
                    variant,
                    className: cn(
                        'flex w-full justify-between px-4 py-2 data-[headlessui-state="active"]:bg-accent data-[headlessui-state="active"]:text-accent-foreground',
                        className,
                    ),
                }),
            )}
            {...props}
        />
    )
})
MenuItem.displayName = Menu.Item.displayName

export { Menu } from '@headlessui/react'
export { MenuItem, MenuItems, MenuTrigger }
