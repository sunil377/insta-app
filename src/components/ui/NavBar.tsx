import { IDivProps } from '@/helpers/types'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { VariantProps } from 'class-variance-authority'
import { MotionProps } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { buttonVariants } from './button'

/* Navbar */

const Navbar = forwardRef<
    HTMLElement,
    MotionProps &
        React.HTMLAttributes<HTMLElement> & {
            isSheetOpen: boolean
        }
>(({ className, isSheetOpen, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = pathname.startsWith('/message')

    return (
        <nav
            className={cn(
                'fixed inset-y-0 left-0 z-40 flex w-16 flex-col bg-background px-2 py-4 text-foreground',
                {
                    'lg:w-56': !isSheetOpen && !isActive,
                },
                (isSheetOpen ? "border-r-0":"border-r"),
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})

Navbar.displayName = 'Navbar'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isSheetOpen: boolean
}

/* NavButton */

const NavButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, asChild = false, variant, isSheetOpen, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        const pathname = usePathname()
        const isActive = pathname.startsWith('/message')

        return (
            <Comp
                className={cn(
                    buttonVariants({
                        variant,
                        className: cn(
                            'justify-start rounded-md',
                            {
                                'lg:flex lg:w-full lg:gap-x-4':
                                    !isSheetOpen && !isActive,
                            },
                            className,
                        ),
                    }),
                )}
                ref={ref}
                {...props}
            />
        )
    },
)
NavButton.displayName = 'NavButton'

/* NavIconWrapper */

const NavIconWrapper = forwardRef<
    HTMLDivElement,
    IDivProps & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Com = asChild ? Slot : 'div'

    return (
        <Com
            className={cn(
                'inline-flex h-12 w-12 flex-none items-center justify-center text-2xl leading-none',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})
NavIconWrapper.displayName = 'NavIconWrapper'

/* NavIconAnimation */

const NavIconAnimation = forwardRef<
    HTMLDivElement,
    IDivProps & { asChild?: boolean }
>(({ className, asChild = true, ...props }, ref) => {
    const Com = asChild ? Slot : 'div'

    return (
        <Com
            className={cn(
                'transfrom flex-none transition-transform group-hover:scale-110',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})
NavIconAnimation.displayName = 'NavIconAnimation'

const NavText = forwardRef<
    HTMLDivElement,
    IDivProps & {
        isSheetOpen: boolean
        asChild?: boolean
    }
>(({ className, asChild = false, isSheetOpen, ...props }, ref) => {
    const Com = asChild ? Slot : 'div'
    const pathname = usePathname()
    const isActive = pathname.startsWith('/message')

    return (
        <Com
            className={cn(
                'hidden',
                {
                    'lg:inline-block': !isSheetOpen && !isActive,
                },
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})
NavText.displayName = 'NavText'

export { NavButton, NavIconAnimation, NavIconWrapper, NavText, Navbar }

