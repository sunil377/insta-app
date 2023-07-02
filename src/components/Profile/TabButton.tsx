import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

function TabButton({ children }: { children: React.ReactNode }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button
                    className={clsx(
                        'border-t-2 p-2',
                        selected ? 'border-t-blue-500' : 'border-t-transparent',
                    )}
                >
                    {children}
                </button>
            )}
        </Tab>
    )
}
export default TabButton
