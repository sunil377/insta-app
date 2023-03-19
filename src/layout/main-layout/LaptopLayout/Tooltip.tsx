import clsx from 'clsx'
import { ReactNode } from 'react'

function ToolTip({
    children,
    isSpread,
}: {
    children: ReactNode
    isSpread: boolean
}) {
    return (
        <div
            className={clsx(
                'invisible absolute left-12 isolate rounded-md border bg-white p-2 align-middle text-xs opacity-0 shadow-md transition-opacity before:absolute before:-left-1 before:top-1/2 before:-z-10 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:transform before:border-b before:border-l before:bg-inherit group-hover:visible group-hover:opacity-100',
                isSpread
                    ? 'lg:visible lg:left-8 lg:border-0 lg:bg-transparent lg:p-0 lg:text-sm lg:opacity-100 lg:shadow-none lg:before:hidden'
                    : '',
            )}
        >
            {children}
        </div>
    )
}

export default ToolTip
