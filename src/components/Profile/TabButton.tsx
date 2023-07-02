import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'

function TabButton({
    children,
    userId,
    params,
}: {
    children: React.ReactNode
    userId: string
    params: 'saved' | 'posts' | 'tagged'
}) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <Link
                    href={`/${userId}?search=${params}`}
                    className={clsx(
                        'inline-block border-t-2 p-2',
                        selected ? 'border-t-blue-500' : 'border-t-transparent',
                    )}
                >
                    {children}
                </Link>
            )}
        </Tab>
    )
}
export default TabButton
